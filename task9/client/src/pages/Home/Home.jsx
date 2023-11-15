import React from "react";
import {Title} from "../../components/Title/Title";
import {Button} from "../../components/Button/Button";
import {TextField} from "../../components/TextField/TextField";
import {Controller, useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {Router} from "../../constants/router";
import {GameHttpService} from "../../services/gameHttpService";
import './Home.style.scss'


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
        GameHttpService.createGame()
            .then(()=>{
                navigate(Router.ROOM)
            })
    }

    const onSubmit = ()=>{
        GameHttpService.joinGame(roomId)
            .then(()=>{
                navigate(Router.ROOM)
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