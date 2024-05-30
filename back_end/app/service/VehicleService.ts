// vehicle.service.ts

import Vehicle from "../model/Vehicle.model";

class VehicleService {
    async createVehicle(vehicleName: string): Promise<Vehicle> {
        return Vehicle.create({ vehicleName });
    }

    async getVehicles(): Promise<Vehicle[]> {
        return Vehicle.findAll();
    }

    async getVehicleById(id: number): Promise<Vehicle | null> {
        return Vehicle.findByPk(id);
    }

    async updateVehicle(id: number, vehicleName: string): Promise<Vehicle | null> {
        const vehicle = await Vehicle.findByPk(id);
        if (vehicle) {
            vehicle.vehicleName = vehicleName;
            await vehicle.save();
            return vehicle;
        }
        return null;
    }

    async deleteVehicle(id: number): Promise<number> {
        const vehicle = await Vehicle.findByPk(id);
        if (vehicle) {
            await vehicle.destroy();
            return vehicle.id;
        }
        return 0;
    }
}

export default VehicleService;