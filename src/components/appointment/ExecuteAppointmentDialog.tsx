
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExecuteAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExecute: () => void;
  appointment: {
    id: string;
    clientName: string;
  };
}

export default function ExecuteAppointmentDialog({
  open,
  onOpenChange,
  onExecute,
  appointment,
}: ExecuteAppointmentDialogProps) {
  const [financialRecord, setFinancialRecord] = useState({
    amount: 0,
    description: "",
    type: "income" as "income" | "expense",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Executar Atendimento</DialogTitle>
          <DialogDescription>
            Marcar atendimento como concluído e registrar valor recebido.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="record-type">Tipo de Registro</Label>
            <Select
              value={financialRecord.type}
              onValueChange={(value) =>
                setFinancialRecord((prev) => ({
                  ...prev,
                  type: value as "income" | "expense",
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Receita</SelectItem>
                <SelectItem value="expense">Despesa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              type="number"
              value={financialRecord.amount}
              onChange={(e) =>
                setFinancialRecord((prev) => ({
                  ...prev,
                  amount: parseFloat(e.target.value) || 0,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={financialRecord.description}
              onChange={(e) =>
                setFinancialRecord((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder={`${
                financialRecord.type === "income" ? "Atendimento" : "Despesa"
              } - ${appointment.clientName}`}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onExecute}>
            <Check className="h-4 w-4 mr-2" />
            Concluir Atendimento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
