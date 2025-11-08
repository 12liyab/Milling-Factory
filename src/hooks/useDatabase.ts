import { useState, useEffect } from 'react';
import { ref, onValue, push, set, remove, update } from 'firebase/database';
import { database } from '../config/firebase';
import { SalesRecord, MachineType } from '../types';

export function useSalesRecords() {
  const [records, setRecords] = useState<SalesRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const recordsRef = ref(database, 'sales');
    const unsubscribe = onValue(recordsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const recordsArray = Object.entries(data).map(([id, record]: [string, any]) => ({
          id,
          ...record
        }));
        setRecords(recordsArray.sort((a, b) => b.createdAt - a.createdAt));
      } else {
        setRecords([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addRecord = async (record: Omit<SalesRecord, 'id' | 'createdAt'>) => {
    const recordsRef = ref(database, 'sales');
    const newRecordRef = push(recordsRef);
    await set(newRecordRef, {
      ...record,
      createdAt: Date.now()
    });
  };

  const updateRecord = async (id: string, updates: Partial<SalesRecord>) => {
    const recordRef = ref(database, `sales/${id}`);
    await update(recordRef, updates);
  };

  const deleteRecord = async (id: string) => {
    const recordRef = ref(database, `sales/${id}`);
    await remove(recordRef);
  };

  const clearAllRecords = async () => {
    const recordsRef = ref(database, 'sales');
    await remove(recordsRef);
  };

  return { records, loading, addRecord, updateRecord, deleteRecord, clearAllRecords };
}

export function useMachineTypes() {
  const [machineTypes, setMachineTypes] = useState<MachineType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const machinesRef = ref(database, 'machines');
    const unsubscribe = onValue(machinesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const machinesArray = Object.entries(data).map(([id, machine]: [string, any]) => ({
          id,
          ...machine
        }));
        setMachineTypes(machinesArray);
      } else {
        const defaultMachines: Omit<MachineType, 'id'>[] = [
          { name: 'Corn Mill', basePrice: 5, unit: 'kg' },
          { name: 'Cassava', basePrice: 8, unit: 'kg' },
          { name: 'Fufu', basePrice: 10, unit: 'bowl' },
          { name: 'Pepper', basePrice: 3, unit: 'kg' },
          { name: 'Wet Corn', basePrice: 6, unit: 'kg' },
          { name: 'Dry Corn', basePrice: 4, unit: 'kg' }
        ];

        defaultMachines.forEach(async (machine) => {
          const machinesRef = ref(database, 'machines');
          const newMachineRef = push(machinesRef);
          await set(newMachineRef, machine);
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addMachineType = async (machine: Omit<MachineType, 'id'>) => {
    const machinesRef = ref(database, 'machines');
    const newMachineRef = push(machinesRef);
    await set(newMachineRef, machine);
  };

  const updateMachineType = async (id: string, updates: Partial<MachineType>) => {
    const machineRef = ref(database, `machines/${id}`);
    await update(machineRef, updates);
  };

  const deleteMachineType = async (id: string) => {
    const machineRef = ref(database, `machines/${id}`);
    await remove(machineRef);
  };

  return { machineTypes, loading, addMachineType, updateMachineType, deleteMachineType };
}
