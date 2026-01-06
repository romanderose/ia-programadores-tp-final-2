/**
 * LoginScreen.tsx
 * 
 * Pantalla contenedora del inicio de sesión.
 */

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { PawPrint } from "lucide-react";
import type { UserRole } from "../App";

interface LoginScreenProps {
  onLogin: (role: UserRole, email: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<"owner" | "vet">("owner");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole, email);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="w-full space-y-8">
        {/* Logo and Title */}
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-emerald-600 rounded-full p-5 shadow-lg">
            <PawPrint className="size-10 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-emerald-900">ABLOVI</h1>
            <p className="text-emerald-700 mt-1">Gestión Veterinaria</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role Selector */}
          <div className="space-y-2">
            <Label className="text-emerald-900">Tipo de Usuario</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("owner")}
                className={`h-12 rounded-xl border-2 transition-all ${selectedRole === "owner"
                    ? "border-emerald-600 bg-emerald-600 text-white shadow-md"
                    : "border-emerald-200 bg-white text-emerald-700 hover:border-emerald-300"
                  }`}
              >
                Dueño
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("vet")}
                className={`h-12 rounded-xl border-2 transition-all ${selectedRole === "vet"
                    ? "border-emerald-600 bg-emerald-600 text-white shadow-md"
                    : "border-emerald-200 bg-white text-emerald-700 hover:border-emerald-300"
                  }`}
              >
                Veterinario
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-emerald-900">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 rounded-xl border-emerald-200 focus:border-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-emerald-900">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 rounded-xl border-emerald-200 focus:border-emerald-500"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-md"
          >
            Ingresar
          </Button>
        </form>

        {/* Create Account Link */}
        <div className="text-center">
          <p className="text-emerald-700">
            ¿No tienes cuenta?{" "}
            <a href="#" className="text-emerald-900 hover:underline">
              Crear cuenta
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
