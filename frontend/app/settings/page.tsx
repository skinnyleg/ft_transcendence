'use client'

import TopBar from "../ui/top";
import QRCode from 'qrcode.react';
import { Switch } from '@headlessui/react'
import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "@nextui-org/react";
import { profileNickPic } from "../interfaces/interfaces";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { ContextProvider, picturesContext } from "../context/profileContext";
import { url } from "inspector";

const settings = () => {

    const [enabled, setEnabled] = useState(false);
    const [newNick, setNewNick] = useState<string> ('');
    const [pass, setPass] = useState<string>('');
    const [passConfirmation, setPassconfirmation] = useState<string>('');
    const [Qr, setQr] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const avatarRef = useRef<HTMLInputElement>(null);
    const [QrEnabled, setQrEnabled] = useState<boolean>(false);
    const [Error, setError] = useState("");

    useEffect(() => {
        const checkVerification = async () => {
            try {      
              const res = await fetch("http://localhost:8000/auth/CheckFirstLogin", {
                method: 'GET',
                credentials: 'include',
              headers: {
                  'Content-Type': 'application/json',
              },
              });
              if (res.status === 200){
                const isfirst = await res.json();
                (isfirst.FirstLogin === true) && toast.info("This is your first time\n you can change your nickname, set your Password or enable 2FA", {
                    toastId: "info", autoClose: 7000,});
              }
              else{
                toast.error("Error faild load ressources", {toastId: "top-right", autoClose: 4000,});
              }
            } catch (error) {
                toast.error(error as string, {toastId: "top-right", autoClose: 4000,});
            }
        };  
        checkVerification();
      }, []);

      useEffect(() => {
        const UpdateStatus = async () => {
            try{
                const results = await axios.post("http://localhost:8000/auth/UpdateFirstLogin", {}, {withCredentials:true});
                console.log("res == ", results);
                if (results.status === 200)
                {
                    console.log("LOOL")
                }
                else {
                    setError("Unable To change Nickname Please try again");
                }
            } catch (error : any) {
                console.log("error == ", error);
                setError(error.response.data.message);
            }
            
        }
        const IsQrEnabled = async () => {
          try {
            const res = await fetch(`http://localhost:8000/user/qrEnabled`, {
              method: "GET",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
              const enable = await res.json();
              console.log(enable);
              setQrEnabled(enable.isEnabled);
            }
          } catch (error : any) {
            setError(error.response.data.message[0]);
          }
        };
        IsQrEnabled();
        UpdateStatus();
      }, []);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            try{
                const results = await fetch(`http://localhost:8000/upload/BackgroundPic`, {
                credentials: 'include',
                method: 'POST',
                body: formData,})
                console.log ("file === ", results);

                if (results.ok){
                    console.log ("file === ", file);
                }
                else {
                    setError("Unable To change Picture Please try again");
                }
            } catch (error : any) {
                setError(error.response.data.message[0]);
            }
            updateProfile(null, event.target.files?.[0].name, null);
        }
      };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const avatarFile = e.target.files?.[0];
        if (avatarFile)
        {
            const formData = new FormData();
            formData.append("file", avatarFile);
            try{
                const results = await fetch(`http://localhost:8000/upload/ProfilePic`, {
                credentials: 'include',
                method: 'POST',
                body: formData,})
                if (results.ok){
                }
                else {
                    setError("Unable To change Picture Please try again");
                }
            } catch (error : any) {
                setError(error.response.data.message[0]);
            }
            updateProfile(e.target.files?.[0].name, null, null);
        }
    }
    const HandleNickChange = async () => {
        if (newNick){
            try{
                const results = await axios.post("http://localhost:8000/user/nick", {nickname : newNick}, {withCredentials:true});
                console.log(results.status);
                if (results.status === 201){
                    console.log("YYYYYYo")
                }
                else {
                    setError("Unable To change Nickname Please try again");
                }
            } catch (error : any) {
                setError(error.response.data.message[0]);
            }finally {
                setNewNick('');
            }
            updateProfile(null, null, newNick);
        }
    }

    const handleFileAdd = () => {
        fileRef.current!.click();
    };
    const handleAvatarAdd = () => {
        avatarRef.current!.click();
    }
    const AddNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewNick(e.target.value);
    }
    const passChange = (e : React.ChangeEvent<HTMLInputElement>) => {setPass(e.target.value)}
    const passconfirmation = (e : React.ChangeEvent<HTMLInputElement>) => { if (pass === e.target.value) {setPassconfirmation(e.target.value)}}
    const HandlePassChange = async () => {
        console.log("honaaaa")
        if (passConfirmation)
        {
            try{
                const results =  await axios.post("http://localhost:8000/user/pass", {password : passConfirmation}, {withCredentials : true});
                if (results.status === 201){
                    setPass('');
                    setPassconfirmation('');
                }
                else {
                    setError("Unable To change Nickname Please try again");
                }
            } catch (error : any) {
                setError(error.response.data.message[0]);
            }
        }

    }

    const enableQrVer = async () => {
        try{
            const results =  await axios.post("http://localhost:8000/user/2FA", {Enabled : true}, {withCredentials : true});
            console.log("srta", results.status);
            if (results.status === 201){
                console.log("YYYYYYo")
            }
            else {
                console.log("error");
                setError("Unable To change Nickname Please try again");
            }
        } catch (error : any) {
            setError(error.response.data.message[0]);
        }
    }

    const gnerateQrCode = async () => {
        try{
            const results =  await axios.get("http://localhost:8000/user/GenerateQr", {withCredentials : true});
            if (results.status === 200){
                setEnabled(!enabled);
                console.log(results.data)
                setQr(results.data.img)
            }
        } catch (error : any){
            setError(error.response.data.message[0]);
        }
    }

   if (Error)
    toast.error(Error as string, {toastId: Error, autoClose: 1000});

    const {profilePic, backgroundPic, nickname, updateProfile} = useContext(picturesContext)

    return (
        <main className="flex flex-col font-white bg-main xl:overflow-y-hidden overflow-y-styled-scrollbar lg:h-screen xl:h-screen md:h-screen h-full mr-2">
            <TopBar />
            <div className="flex flex-col w-full h-full mt-10 justify-between"> 
                <div className="relative xl:h-[30vh] lg:h-[30vh] md:h-[30vh] h-[30vh] mt-10">
                    <div onClick={handleFileAdd} className="w-full rounded-md relative h-full mx-auto hover:cursor-pointer">
                        <img alt="background" src={backgroundPic} className="w-full rounded-md h-full object-cover"/>
                        <label htmlFor="file"></label>
                        <input type="file" id="file" className="hidden" ref={fileRef} onChange={handleFileChange}/>
                        <div className="absolute right-10 -translate-x-1/2 -translate-y-1/2 text-[50px] rounded-full bg-white">
                            <PlusCircleIcon className="text-accents w-10 h-10" />
                        </div>
                    </div>
                    <div onClick={handleAvatarAdd} className="absolute -bottom-10 left-5 hover:cursor-pointer lg:w-[100px] md:w-[90px] w-[80px] xl:h-[150px] xl:w-[150px]">
                        <div className="rounded-full h-full xl:max-w-[100%] xl:max-h-[100%] min-w-[100%] min-h-[100%]">
                            <img alt="avatar" src={profilePic} className="w-full rounded-full h-full xl:max-w-[100%] xl:max-h-[100%] min-w-[100%] min-h-[100%]"/>
                        </div>
                        <label htmlFor="file"></label>
                        <input type="file" id="file" className="hidden" ref={avatarRef} onChange={handleAvatarChange}/>
                        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-[50px] rounded-full bg-white">
                            <PlusCircleIcon className="text-accents w-10 h-10" />
                        </div>
                    </div>
                </div>
                <div className="flex border-2 border-gray-200 xl:h-[50vh] lg:h-[50vh] md:h-[54vh] h-full w-full mt-20 rounded-lg">
                    <div className="flex xl:flex-row lg:flex-row md:flex-row h-[50%] flex-col md:p-2 lg:p-10 xl:p-10 p-1 justify-between xl:w-full lg:w-full w-full md:w-[80%]">
                        <div className="flex flex-col xl:w-[30%] h-[50%] lg:w-[40%] w-[90%] p-5 md:mt-10 mt-0 xl:ml-10 ml-5">
                            <div className="mb-6">
                                <label className="text-gray-500 w-[90%] xl:text-md lg:text-md md:text-sm text-sm xl:ml-10 lg:ml-10 md:ml-5 ml-0 mt-10 m-1">Change Nickname</label>
                                <input className="text-black w-[90%] rounded-lg" placeholder="Change Nickname..." type="text" onChange={AddNickname} value={newNick}></input>
                            </div>
                            <div className={`${newNick ? 'flex' : 'hidden'} mb-10`}>
                                <Button type="submit" radius="md" className={`block bg-gradient-to-tr from-accents to-back text-white shadow-lg 
                                    hover:from-accents hover:to-main hover:to-lightQuartzetext-white`} onClick={HandleNickChange}>
                                    save
                                </Button>
                            </div>
                            <div className="mb-6">
                                <label className="text-gray-500 w-[90%] xl:text-md lg:text-md md:text-sm text-sm xl:ml-10 lg:ml-10 md:ml-5 ml-0 mt-10 m-1">Change Password</label>
                                <input className="text-black w-[90%] rounded-lg" placeholder="Change Password..." type="password" min={8} onChange={passChange} value={pass}></input>
                            </div>
                            <div className="mb-2">
                                <label className="text-gray-500 w-[90%] xl:text-md lg:text-md md:text-sm text-sm xl:ml-10 lg:ml-10 md:ml-5 ml-0 mt-10 m-1">Confirm Password</label>
                                <input className="text-black w-[90%] rounded-lg" typeof="submit" placeholder="re-type your Password..." min={8} type="password" onChange={passconfirmation}></input>
                            </div>
                            <div className={`${passConfirmation ? 'flex' : 'hidden'} mb-10`}>
                                <Button type="submit" radius="md" className={`block bg-gradient-to-tr from-accents to-back text-white shadow-lg 
                                    hover:from-accents hover:to-main hover:to-lightQuartzetext-white`} onClick={() => {HandlePassChange}}>
                                    save
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col  h-[50%] xl:w-[35%] lg:w-[35%] md:w-[35%] w-[90%] p-3 xl:mr-10 mr-0 lg:mt-10 xl:mt-10 md:mt-10 mt-0 xl:ml-0 ml-5">
                            <div className="flex h-[5vh] justify-between">
                                <div className="text-white text-bold-300 text-lg">Enable 2FA </div>
                                <Switch
                                    checked={enabled}
                                    onChange={gnerateQrCode}
                                    className={`${enabled ? 'bg-accents' : 'bg-back'}
                                    inline-flex h-[38px] w-[74px] shrink-0 mb-5 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
                                >
                                    <span
                                    aria-hidden="true"
                                    className={`${enabled ? 'translate-x-9' : 'translate-x-0'}
                                        pointer-events-none inline-block h-[34px] w-[34px] transform  rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                                    />
                                </Switch>
                            </div>
                            <h3 className={`${enabled ? 'flex': "hidden"} text-red-400 xl:text-md lg:text-md md:text-sm text-sm w-full mt-2`}>Please scan or disable QR code before leaving the page</h3>
                            <div className={`${enabled ? 'flex': "hidden"} mt-5 border-2 border-accents xl:h-[20vh] lg:h-[20vh] md:h-[20vh] h-auto w-[90%] mx-auto `} style={{ height: "auto", maxWidth: 260, width: "100%" }}>
                                <QRCode
                                size={256}
                                style={{ height: "auto"}}
                                className="w-[70%] h-[50%]"
                                value={Qr as string}
                                viewBox={`0 0 256 256`}
                                />
                            </div>
                            <div className={`flex mt-2 mx-auto`}>
                                <Button radius="md" size="lg" className={`${enabled ? 'block' : 'hidden'} bg-gradient-to-tr from-accents to-back text-white shadow-lg 
                                    hover:from-accents hover:to-main hover:to-lightQuartzetext-white`} onClick={enableQrVer}>
                                    { QrEnabled ? 'Disable' : 'Enable'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default (settings);