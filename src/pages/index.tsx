import React, { useRef, useCallback, useContext } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { FiMail, FiLock } from 'react-icons/fi';
import * as Yup from 'yup';

import getValidationErrors from '@utils/getValidationErrors';
import { AuthContext } from '@contexts/AuthContext';

import Head from '@components/Head';
import Input from '@components/Input';
import Button from '@components/Button';

import styles from '@page-styles/home.module.scss';

interface SignInFormData {
  email: string;
  password: string;
}

export default function Home() {
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useContext(AuthContext);

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um email válido'),
          password: Yup.string().required('Senha obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn(data);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
        }
      }
    },
    [signIn],
  );

  return (
    <>
      <Head title="Login" />

      <main className={styles.container}>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Faça seu login</h1>

          <Input name="email" icon={FiMail} placeholder="E-mail" />

          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Senha"
          />

          <Button type="submit">Entrar</Button>
        </Form>
      </main>
    </>
  );
}
