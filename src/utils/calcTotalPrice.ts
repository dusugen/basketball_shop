import {CartItem} from "../redux/slices/cartSlice";

export const calcTotalPrice = (items: CartItem[]) => {
    const totalPrice = items.reduce((sum: number, obj: CartItem) => sum + (obj.price * obj.count), 0)
    return totalPrice;
}