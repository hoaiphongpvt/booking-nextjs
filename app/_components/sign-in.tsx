import { signIn } from '@/app/_lib/auth'

export default function SignIn() {
  return (
    <form
      action={async () => {
        'use server'
        await signIn('google')
      }}
    >
      <button type='submit'>Signin with Google</button>
    </form>
  )
}
