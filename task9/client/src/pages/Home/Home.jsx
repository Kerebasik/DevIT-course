import React from "react";
import {Title} from "../../components/Title/Title";
import {Button} from "../../components/Button/Button";
import {TextField} from "../../components/TextField/TextField";

import './Home.style.scss'
import {Controller, useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {Router} from "../../constants/router";


const Home = ()=>{
    const navigate = useNavigate()
    const { control,
        watch,
        handleSubmit,
        reset
    } = useForm({
        defaultValues:{
            roomId:''
        }
    })
    const roomId = watch('roomId');

    const handleNewRoomOnClick = ()=>{
        new Promise((resolve)=>{
            resolve()
        }).then(()=>{
            navigate(Router.ROOM+'/122')
        })
    }

    const onSubmit = ()=>{
        new Promise((resolve)=>{
            console.log(roomId)
            resolve()
        })
            .then(()=>{
                navigate(Router.ROOM+'/121')
            })
            .catch(()=>{
            })
            .finally(()=>{
                reset()
            })
    }

    return(
        <div className={'home'}>
            <div className={'home__content'}>
                <Title size={108}>
                    Black Jack
                </Title>
                <div className={'home__content__panel'}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Button handleOnClick={handleNewRoomOnClick}>Создать комнату</Button>
                        <Controller
                            name='roomId'
                            control={control}
                            rules={{
                                required: {
                                    value: true,
                                    message: 'Токен комнаты обязателен',
                                }
                            }}
                            render={ ({ field, fieldState })=>{
                               return <TextField
                                   error={!!fieldState.error}
                                   value={field.value}
                                   helperText={fieldState?.error?.message}
                                   onChange={field.onChange}
                                   placeholder={'Введите токен комнаты'}/>
                            }
                        }/>

                        <Button type={'submit'}>Войти в комнату</Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export {Home}