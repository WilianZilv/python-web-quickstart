import { ZodError, ZodIssue, ZodSchema } from "zod";



export function handleSubmit(schema: ZodSchema<any>, setErrors: (errors: any) => void, onSuccess: (data: Record<string, any>) => void) {

    return (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const values = Object.fromEntries(formData.entries());

        try {

            const data = schema.parse(values);

            setErrors({});

            onSuccess(data);


        } catch (error) {

            if (error instanceof ZodError) {

                const field_errors = error.issues.reduce((acc: Record<string, string>, issue: ZodIssue) => {
                    acc[issue.path[0]] = issue.message;
                    return acc;
                }, {});
                setErrors(field_errors);
            }
        }


    }

}
