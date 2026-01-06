/**
 * apiService.ts
 * 
 * Servicio centralizado para realizar peticiones a la API del Backend (excepto Auth).
 * Maneja Mascotas, Turnos, Historiales, Registros y Eventos.
 * Incluye automáticamente el token JWT en los headers.
 */

const API_URL = 'http://localhost:3001/api';

function getHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
}

export const apiService = {
    // Mascotas
    getMascotas: async () => {
        const res = await fetch(`${API_URL}/mascotas`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Error fetching mascotas');
        return res.json();
    },

    createMascota: async (mascota: any) => {
        const response = await fetch(`${API_URL}/mascotas`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(mascota),
        });
        if (!response.ok) throw new Error('Error al crear mascota');
        return response.json();
    },

    updateMascota: async (id: string, mascota: any) => {
        const response = await fetch(`${API_URL}/mascotas/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(mascota),
        });
        if (!response.ok) throw new Error('Error al actualizar mascota');
        return response.json();
    },

    deleteMascota: async (id: string | number) => {
        const res = await fetch(`${API_URL}/mascotas/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Error deleting mascota');
        return res.json();
    },

    // Turnos
    getTurnos: async () => {
        const res = await fetch(`${API_URL}/turnos`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Error fetching turnos');
        return res.json();
    },

    createTurno: async (data: any) => {
        const res = await fetch(`${API_URL}/turnos`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Error creating turno');
        return res.json();
    },

    // Historial
    getHistorial: async () => {
        const res = await fetch(`${API_URL}/historial`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Error fetching historial');
        return res.json();
    },

    // Registros Clínicos (user-created records) - DEPRECATED
    getRegistros: async () => {
        const res = await fetch(`${API_URL}/registros`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Error fetching registros');
        return res.json();
    },

    createRegistro: async (data: any) => {
        const res = await fetch(`${API_URL}/registros`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Error creating registro');
        return res.json();
    },

    checkPetHasRecords: async (mascotaId: number) => {
        const res = await fetch(`${API_URL}/registros/check/${mascotaId}`, {
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Error checking pet records');
        return res.json();
    },

    // Historiales Clínicos (new structure)
    getHistoriales: async () => {
        const res = await fetch(`${API_URL}/historiales`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Error fetching historiales');
        return res.json();
    },

    checkPetHasHistory: async (mascotaId: number) => {
        const res = await fetch(`${API_URL}/historiales/check/${mascotaId}`, {
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Error checking pet history');
        return res.json();
    },

    createHistorial: async (data: any) => {
        const res = await fetch(`${API_URL}/historiales`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Error creating historial');
        return res.json();
    },

    // Eventos Clínicos
    createEvento: async (data: any) => {
        const res = await fetch(`${API_URL}/eventos`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Error creating evento');
        return res.json();
    },

    updateEvento: async (id: number, data: any) => {
        const res = await fetch(`${API_URL}/eventos/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Error updating evento');
        return res.json();
    },

    deleteEvento: async (id: number) => {
        const res = await fetch(`${API_URL}/eventos/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Error deleting evento');
        return res.json();
    }
};
