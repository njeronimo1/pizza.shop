import { Building, ChevronDown, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/api/get-profile";
import { getManagedRestaurant } from "@/api/get-managed-restaurant";
import { Skeleton } from "./ui/skeleton";
import { Dialog, DialogTrigger } from "./ui/dialog";

export function AccountMenu(){

    const { data: profile, isLoading: isLoadingProfile } = useQuery({
        queryFn: getProfile,
        queryKey: ['profile'],
    })
    
    const { data: managedRestaurant, isLoading: isLoadingManagedRestaurant } = useQuery({
        queryFn: getManagedRestaurant,
        queryKey: ['managed-restaurant'],
    })

    return(
        <Dialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 select-none">

                        {isLoadingManagedRestaurant ? (
                            <Skeleton className="h-4 w-40" />
                        ) : managedRestaurant?.name}
                        <ChevronDown className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="flex flex-col">
                        {isLoadingProfile ? (
                            <div className="space-y-1.5">
                                <Skeleton className="h-4 w-32"/>
                                <Skeleton className="h-3 w-24"/>
                            </div>
                        ): (
                            <>
                                <span>{profile?.name}</span>
                                <span className="text-cs font-normal text-muted-foreground">{profile?.email}</span>
                            </>
                        )}
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />
                    
                    <DialogTrigger asChild>
                        <DropdownMenuItem>
                            <Building className="mr-2 h-4 w-4"/>
                            <span>Perfil da loja</span>
                        </DropdownMenuItem>
                    </DialogTrigger>

                    <DropdownMenuItem className="text-rose-500 dark:text-rose-400">
                        <LogOut className="mr-2 h-4 w-4"/>
                        <span>Sair</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            
        </Dialog>
    )
}