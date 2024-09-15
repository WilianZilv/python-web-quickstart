import { AlertCircle } from 'lucide-react'


export function FieldError({ errors, path }: any) {
    const message = errors[path];
    return message ? <div className='flex items-center gap-1'>
        <AlertCircle size={12} className='text-red-500' />
        <p className="text-xs text-red-500" > {message} </p>
    </div>
        : null

}