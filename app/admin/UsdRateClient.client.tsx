"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function UsdRateCard() {
    const [usdRate, setUsdRate] = useState<number>(0);
    const [transferMultiplier, setTransferMultiplier] = useState<number>(1.05);
    const [listMultiplier, setListMultiplier] = useState<number>(1.55);

    const [usdInput, setUsdInput] = useState<string>("");
    const [transferInput, setTransferInput] = useState<string>("");
    const [listInput, setListInput] = useState<string>("");

    useEffect(() => {
        async function loadSettings() {
            try {
                const res = await fetch("/api/settings");
                if (!res.ok) return;

                const data = await res.json();

                setUsdRate(data.usd_rate);
                setTransferMultiplier(data.transfer_multiplier);
                setListMultiplier(data.list_multiplier);

                setUsdInput(data.usd_rate.toString());
                setTransferInput(data.transfer_multiplier.toString());
                setListInput(data.list_multiplier.toString());
            } catch {
                return;
            }
        }

        loadSettings();
    }, []);

    const handleSave = async () => {
        try {
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    usd_rate: Number(usdInput),
                    transfer_multiplier: Number(transferInput),
                    list_multiplier: Number(listInput),
                }),
            });

            if (!res.ok) return;

            const data = await res.json();

            setUsdRate(data.usd_rate);
            setTransferMultiplier(data.transfer_multiplier);
            setListMultiplier(data.list_multiplier);
            window.dispatchEvent(new Event("settings:updated"));
        } catch {
            return;
        }
    };

    return (
        <Card className="select-none border-neutral-200 bg-white">
            <CardHeader>
                <CardTitle className="text-neutral-900">
                    ConfiguraciÃ³n de precios
                </CardTitle>
                <CardDescription className="text-neutral-700">
                    Estos valores afectan a todos los productos
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* USD RATE */}
                <div>
                    <label className="text-sm font-medium">Valor del dÃ³lar</label>
                    <input
                        value={usdInput}
                        onChange={(e) => setUsdInput(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Actual: <span className="font-semibold">${usdRate}</span>
                    </p>
                </div>

                {/* TRANSFER MULTIPLIER */}
                <div>
                    <label className="text-sm font-medium">
                        % Para un pago 
                    </label>
                    <input
                        value={transferInput}
                        onChange={(e) => setTransferInput(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Actual: <span className="font-semibold">{transferMultiplier}</span>
                    </p>
                </div>

                {/* LIST MULTIPLIER */}
                <div>
                    <label className="text-sm font-medium">Factor Mercado Pago</label>
                    <input
                        value={listInput}
                        onChange={(e) => setListInput(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Actual: <span className="font-semibold">{listMultiplier}</span>
                    </p>
                </div>

                <Button
                    onClick={handleSave}
                    className="bg-neutral-900 text-white hover:bg-neutral-800 w-full "
                >
                    Guardar cambios
                </Button>
            </CardContent>
        </Card>
    );
}
