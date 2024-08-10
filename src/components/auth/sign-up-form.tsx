'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import axios from 'axios';

import { paths } from '../../paths';

const schema = zod.object({
  fullName: zod.string().min(1, { message: 'Full name is required' }),
  email: zod.string().min(1, { message: 'Email is required' }).email(),
  password: zod.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: zod.string().min(6, { message: 'Confirm Password is required' }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type Values = zod.infer<typeof schema>;

export function SignUpForm(): React.JSX.Element {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);

      try {
        const response = await axios.post('http://localhost:5224/api/Auth/Register', values);
        if (response.status === 200) {
          router.push(paths.auth.signIn); // Redirect to sign-in page on successful registration
        }
      } catch (e) {

      }
    },
    [router, setError]
  );

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4">Kayıt Ol</Typography>
        <Typography color="text.secondary" variant="body2">
          Zaten bir hesabınız var mı?{' '}
          <Link component={RouterLink} href={paths.auth.signIn} underline="hover" variant="subtitle2">
            Giriş Yap
          </Link>
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="fullName"
            render={({ field }) => (
              <FormControl error={Boolean(errors.fullName)}>
                <InputLabel>Ad Soyad</InputLabel>
                <OutlinedInput {...field} label="Ad Soyad" />
                {errors.fullName ? <FormHelperText>{errors.fullName.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>Email Adresi</InputLabel>
                <OutlinedInput {...field} label="Email Adresi" type="email" />
                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Şifre</InputLabel>
                <OutlinedInput
                  {...field}
                  endAdornment={
                    showPassword ? (
                      <EyeIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowPassword(false);
                        }}
                      />
                    ) : (
                      <EyeSlashIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowPassword(true);
                        }}
                      />
                    )
                  }
                  label="Şifre"
                  type={showPassword ? 'text' : 'password'}
                />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <FormControl error={Boolean(errors.confirmPassword)}>
                <InputLabel>Şifreyi Onaylayın</InputLabel>
                <OutlinedInput
                  {...field}
                  label="Şifreyi Onaylayın"
                  type={showPassword ? 'text' : 'password'}
                />
                {errors.confirmPassword ? (
                  <FormHelperText>{errors.confirmPassword.message}</FormHelperText>
                ) : null}
              </FormControl>
            )}
          />
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          <Button disabled={isPending} type="submit" variant="contained">
            Kayıt Ol
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
