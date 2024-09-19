import { z } from "zod";


export const Key = z.object({
    key: z.string()
})

export const User = Key.extend({
    uid: z.string()
})

export const Login = Key.extend({
    uname: z.string(),
    pword: z.string()
})