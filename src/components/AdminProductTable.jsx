import { MoreHorizontal, PencilLine, RotateCcw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const AdminProductTable = ({ products, onEdit, onDelete, onRestore }) => {
    return (
        <Table>
            <TableCaption>A list of your recent products.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Product id</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="w-12 text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map((product) => (
                    <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.id}</TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="font-medium">{product.name}</span>
                                {product.deleted && (
                                    <span className="text-xs text-muted-foreground">Deleted</span>
                                )}
                            </div>
                        </TableCell>
                        <TableCell className="max-w-[280px] truncate">{product.description || "No description"}</TableCell>
                        {/* <TableCell className="text-right">{product.deleted ? "Deleted" : "Active"}</TableCell> */}
                        <TableCell className="text-right">
                            <span
                                className={`rounded-full px-2 py-1 text-xs font-medium ${product.deleted
                                        ? "bg-red-500/10 text-red-600"
                                        : "bg-emerald-500/10 text-emerald-600"
                                    }`}
                            >
                                {product.deleted ? "Deleted" : "Active"}
                            </span>
                        </TableCell>

                        <TableCell className="text-right">{product.quantity}</TableCell>
                        <TableCell className="text-right">₹{Number(product.price || 0).toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label={`Manage ${product.name}`}
                                        className="size-8 rounded-full"
                                    >
                                        <MoreHorizontal className="size-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onSelect={() => onEdit(product)}>
                                        <PencilLine className="mr-2 size-4" />
                                        Edit
                                    </DropdownMenuItem>
                                    {product.deleted ? (
                                        <DropdownMenuItem onSelect={() => onRestore(product.id)}>
                                            <RotateCcw className="mr-2 size-4" />
                                            Restore
                                        </DropdownMenuItem>
                                    ) : (
                                        <DropdownMenuItem
                                            onSelect={() => onDelete(product.id)}
                                            className="text-destructive focus:text-destructive"
                                        >
                                            <Trash2 className="mr-2 size-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={4}>Total</TableCell>
                    <TableCell className="text-right">{products.reduce((total, product) => total + Number(product.quantity || 0), 0)}</TableCell>
                    <TableCell className="text-right">₹{Number(products.reduce((total, product) => total + Number(product.price || 0), 0)).toFixed(2)}</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
};

export { AdminProductTable };
export default AdminProductTable;

