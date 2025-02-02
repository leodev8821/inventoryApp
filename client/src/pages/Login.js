import React, { useContext, useState } from 'react';
import {LopdContext} from '../utils/context/LopdContext';
import { jwtDecode } from 'jwt-decode';
import useNavigation from '../hooks/useNavigation';
import useFetch from '../hooks/useFetch';
import TypeForm from '../components/TypeForm';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import FormField from '../components/FormField';
import Input from '../components/Input';
import Label from '../components/Label';

const Login = () => {
    const [ login, setLogin ] = useState('');
    const [ password, setPassword ] = useState('');
    const { toggleLopd } = useContext(LopdContext);
    const { navigate } = useNavigation();
    

    return (
        <TypeForm>
            <FormField>
                <Label>Login</Label>
                <Input
                    type="text"
                    value={login}
                    placeholder="username/email"
                    onChange={(e) => setLogin(e.target.value)}
                />
            </FormField>
            <FormField>
                <Label>Password</Label>
                <Input
                    type="password"
                    value={password}
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </FormField>
            <FormField>
                <Checkbox
                    checked={remember}
                    onChange={() => setRemember(!remember)}
                />
                <Label>Remember me</Label>
            </FormField>
            <Button onClick={handleLogin}>Login</Button>
        </TypeForm>
    );
};