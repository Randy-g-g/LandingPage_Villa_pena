"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservasService = void 0;
const common_1 = require("@nestjs/common");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
let ReservasService = class ReservasService {
    archivo = (0, node_path_1.join)(process.cwd(), 'data', 'reservas.json');
    DURACION = 8 * 60;
    APERTURA = 6 * 60;
    CIERRE = 18 * 60;
    cola = Promise.resolve();
    ejecutarEnOrden(operacion) {
        const resultado = this.cola.then(operacion);
        this.cola = resultado.then(() => undefined, () => undefined);
        return resultado;
    }
    async leerReservas() {
        try {
            const contenido = await node_fs_1.promises.readFile(this.archivo, 'utf8');
            const reservas = JSON.parse(contenido);
            if (!Array.isArray(reservas)) {
                throw new Error('El archivo reservas.json debe contener un arreglo');
            }
            return reservas;
        }
        catch (error) {
            if (error instanceof Error &&
                'code' in error &&
                error.code === 'ENOENT') {
                return [];
            }
            throw error;
        }
    }
    async guardarReservas(reservas) {
        await node_fs_1.promises.mkdir((0, node_path_1.join)(process.cwd(), 'data'), { recursive: true });
        const archivoTemporal = `${this.archivo}.tmp`;
        await node_fs_1.promises.writeFile(archivoTemporal, JSON.stringify(reservas, null, 2), 'utf8');
        await node_fs_1.promises.rename(archivoTemporal, this.archivo);
    }
    convertirAMinutos(hora) {
        if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(hora)) {
            throw new common_1.BadRequestException('La hora debe tener el formato HH:mm');
        }
        const [horas, minutos] = hora.split(':').map(Number);
        return horas * 60 + minutos;
    }
    convertirAHora(minutos) {
        const horas = Math.floor(minutos / 60) % 24;
        const minutosRestantes = minutos % 60;
        return (String(horas).padStart(2, '0') +
            ':' +
            String(minutosRestantes).padStart(2, '0'));
    }
    validarFecha(fecha) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
            throw new common_1.BadRequestException('La fecha debe tener el formato YYYY-MM-DD');
        }
        const [anio, mes, dia] = fecha.split('-').map(Number);
        const comprobacion = new Date(Date.UTC(anio, mes - 1, dia));
        if (comprobacion.getUTCFullYear() !== anio ||
            comprobacion.getUTCMonth() !== mes - 1 ||
            comprobacion.getUTCDate() !== dia) {
            throw new common_1.BadRequestException('La fecha seleccionada no existe');
        }
    }
    calcularHorario(fecha, horaInicio) {
        this.validarFecha(fecha);
        const inicio = this.convertirAMinutos(horaInicio);
        const final = inicio + this.DURACION;
        if (inicio < this.APERTURA ||
            final > this.CIERRE) {
            throw new common_1.BadRequestException('La actividad debe realizarse entre las 6:00 AM y las 6:00 PM, con una duración de 8 horas.');
        }
        return {
            endTime: this.convertirAHora(final),
            endDate: fecha,
        };
    }
    comprobarDisponibilidad(reservas, nuevaReserva) {
        if (nuevaReserva.status === 'pendiente') {
            return;
        }
        const conflicto = reservas.some((reserva) => {
            if (reserva.id === nuevaReserva.id) {
                return false;
            }
            if (reserva.date !== nuevaReserva.date) {
                return false;
            }
            if (reserva.status === 'pendiente') {
                return false;
            }
            return (reserva.status === 'confirmada' ||
                reserva.status === 'bloqueada');
        });
        if (conflicto) {
            throw new common_1.ConflictException('La fecha seleccionada ya tiene una actividad confirmada o se encuentra bloqueada.');
        }
    }
    async findAll() {
        return this.leerReservas();
    }
    async findOne(id) {
        const reservas = await this.leerReservas();
        const reserva = reservas.find((item) => item.id === id);
        if (!reserva) {
            throw new common_1.NotFoundException(`No se encontró la reservación con ID ${id}`);
        }
        return reserva;
    }
    async create(dto) {
        return this.ejecutarEnOrden(async () => {
            const reservas = await this.leerReservas();
            const horario = this.calcularHorario(dto.date, dto.time);
            const siguienteId = Math.max(0, ...reservas.map((reserva) => reserva.id)) + 1;
            const nuevaReserva = {
                id: siguienteId,
                name: dto.name,
                date: dto.date,
                time: dto.time,
                endTime: horario.endTime,
                endDate: horario.endDate,
                client: dto.client,
                guests: dto.guests,
                package: dto.package,
                packagePrice: dto.packagePrice,
                status: dto.status,
                phone: dto.phone,
                email: dto.email,
                message: dto.message,
                adicionales: dto.adicionales ?? [],
            };
            this.comprobarDisponibilidad(reservas, nuevaReserva);
            reservas.push(nuevaReserva);
            await this.guardarReservas(reservas);
            return nuevaReserva;
        });
    }
    async update(id, dto) {
        return this.ejecutarEnOrden(async () => {
            const reservas = await this.leerReservas();
            const indice = reservas.findIndex((reserva) => reserva.id === id);
            if (indice === -1) {
                throw new common_1.NotFoundException(`No se encontró la reservación con ID ${id}`);
            }
            const reservaActualizada = {
                ...reservas[indice],
                ...dto,
            };
            const horario = this.calcularHorario(reservaActualizada.date, reservaActualizada.time);
            reservaActualizada.endTime = horario.endTime;
            reservaActualizada.endDate = horario.endDate;
            this.comprobarDisponibilidad(reservas, reservaActualizada);
            reservas[indice] = reservaActualizada;
            await this.guardarReservas(reservas);
            return reservaActualizada;
        });
    }
    async remove(id) {
        return this.ejecutarEnOrden(async () => {
            const reservas = await this.leerReservas();
            const reserva = reservas.find((item) => item.id === id);
            if (!reserva) {
                throw new common_1.NotFoundException(`No se encontró la reservación con ID ${id}`);
            }
            const reservasActualizadas = reservas.filter((item) => item.id !== id);
            await this.guardarReservas(reservasActualizadas);
            return reserva;
        });
    }
};
exports.ReservasService = ReservasService;
exports.ReservasService = ReservasService = __decorate([
    (0, common_1.Injectable)()
], ReservasService);
//# sourceMappingURL=reservas.service.js.map