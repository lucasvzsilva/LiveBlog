import type { InputHTMLAttributes } from 'react'

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

// Campo de input simples + label + mensagem de erro do Zod.
export function Field({ label, error, ...props }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-zinc-700">{label}</span>
      <input
        className="w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        {...props}
      />
      {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
    </label>
  )
}
