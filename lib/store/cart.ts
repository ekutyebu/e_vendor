import { useState, useEffect, useSyncExternalStore } from 'react';

export interface CartItem {
    id: string
    productId: string
    name: string
    price: number
    image: string
    vendorId: string
    vendorName: string
    quantity: number
}

interface CartStore {
    items: CartItem[]
    addItem: (item: Omit<CartItem, 'id'>) => void
    removeItem: (productId: string) => void
    updateQuantity: (productId: string, quantity: number) => void
    clearCart: () => void
    getTotalPrice: () => number
    getTotalItems: () => number
}

const STORAGE_KEY = 'inovamark-cart';

const saveData = (items: CartItem[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ state: { items } }));
    }
};

const initialItems = (): CartItem[] => {
    if (typeof window !== 'undefined') {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (data) {
                const parsed = JSON.parse(data);
                if (parsed?.state?.items) {
                    return parsed.state.items;
                }
            }
        } catch (e) { }
    }
    return [];
};

let listeners: Set<() => void> = new Set();
const notify = () => listeners.forEach(l => l());

let state: CartStore = {
    items: initialItems(),
    addItem: (newItem) => {
        state = {
            ...state,
            items: (() => {
                const existingItem = state.items.find((i) => i.productId === newItem.productId);
                if (existingItem) {
                    return state.items.map((i) => i.productId === newItem.productId ? { ...i, quantity: i.quantity + newItem.quantity } : i);
                }
                return [...state.items, { ...newItem, id: Math.random().toString(36).substring(7) }];
            })()
        };
        saveData(state.items);
        notify();
    },
    removeItem: (productId) => {
        state = { ...state, items: state.items.filter((i) => i.productId !== productId) };
        saveData(state.items);
        notify();
    },
    updateQuantity: (productId, quantity) => {
        state = { ...state, items: state.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)) };
        saveData(state.items);
        notify();
    },
    clearCart: () => {
        state = { ...state, items: [] };
        saveData(state.items);
        notify();
    },
    getTotalPrice: () => state.items.reduce((total, item) => total + item.price * item.quantity, 0),
    getTotalItems: () => state.items.reduce((total, item) => total + item.quantity, 0),
};

const getState = () => state;
const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

export const useCartStore = <T>(selector: (state: CartStore) => T): T => {
    const storeSnapshot = useSyncExternalStore(subscribe, getState, getState);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        const ssrState = { ...state, items: [] as CartItem[] };
        return selector(ssrState);
    }

    return selector(storeSnapshot);
};
