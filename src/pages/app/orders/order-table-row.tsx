import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { ArrowRight, Search, X } from "lucide-react";
import { OrderDetails } from "./order-details";
import { OrderStatus } from "@/components/order-status";
import { formatDistanceToNow } from "date-fns"
import { ptBR} from "date-fns/locale"
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelOrder } from "@/api/cancel-order";
import { GetOrdersResponse } from "@/api/get-orders";

export interface OrderTableRowProps{
    orders: {
        orderId: string
        createdAt: string
        status: "pending" | "canceled" | "processing" | "delivering" | "delivered"
        customerName: string
        total: number
    };
}

export function OrderTableRow({ orders }: OrderTableRowProps){

    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const queryClient = useQueryClient();

    const { mutateAsync: cancelOrderFn } = useMutation({
        mutationFn: cancelOrder,
        async onSuccess(_, {orderId}) {
            const ordersListCached = queryClient.getQueriesData<GetOrdersResponse>({
                queryKey: ["orders"],
            })

            ordersListCached.forEach(([cacheKey, cacheData]) => {
                if(!cacheData) {
                    return
                }

                queryClient.setQueryData<GetOrdersResponse>(cacheKey, {
                    ...cacheData,
                    orders: cacheData.orders.map(order => {
                        if(order.orderId === orderId){
                            return { ...order, status: "canceled"}
                        }

                        return order
                    })
                })
            })
        },
    });

    return(
        <TableRow>
            <TableCell>
                <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="xs">
                            <Search className="h-3 w-3"/>
                            <span className="sr-only">Detalhes do pedido</span>
                        </Button>
                    </DialogTrigger>

                    <OrderDetails open={isDetailOpen}  orderId={orders.orderId}/>
                </Dialog>
            </TableCell>
            <TableCell className="font-mono text-xs font-medium">{orders.orderId}</TableCell>
            <TableCell className="font-muted-foreground">{formatDistanceToNow(orders.createdAt, {
                locale: ptBR,
                addSuffix: true
            })}</TableCell>
            <TableCell>
                <OrderStatus status={orders.status} />
            </TableCell>
            <TableCell className="font-medium">
                {orders.customerName}
            </TableCell>
            <TableCell className="font-medium">
                {(orders.total / 100).toLocaleString('pt-BR', {
                    style: "currency",
                    currency: 'BRL',
                })}
            </TableCell>
            <TableCell>
                <Button variant="outline" size="xs">
                    <ArrowRight className="h-3 w-3 mr-2"/>
                    Aprovar
                </Button>
            </TableCell>
            <TableCell>
                <Button disabled={!["pending", "processing"].includes(orders.status)} variant="ghost" size="xs"
                onClick={() => { cancelOrderFn({orderId: orders.orderId}) }}>
                    <X className="h-3 w-3 mr-2"/>
                    Cancelar
                </Button>
            </TableCell>
        </TableRow>
    )
}