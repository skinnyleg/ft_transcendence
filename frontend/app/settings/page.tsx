'use client'

import TopBar from "../ui/top";
import QRCode from 'qrcode.react';
import { Switch } from '@headlessui/react'
import { useEffect, useRef, useState } from "react";
import { Button } from "@nextui-org/react";
import { profileNickPic } from "../interfaces/interfaces";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import axios from "axios";
// import withAuth from "../withAuth"

const settings = () => {

    const [enabled, setEnabled] = useState(false);
    const [newNick, setNewNick] = useState<string> ('');
    const [pass, setPass] = useState<string | null>(null);
    const [passConfirmation, setPassconfirmation] = useState<string>('');
    const [Qr, setQr] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const avatarRef = useRef<HTMLInputElement>(null);
    const [avatarImage, setAvatarImage] = useState<string>("/yo.jpg")
    const [bgImage, setBgImage] = useState<string>("/yo.jpg")
    const [bg, setBg] = useState<File | undefined>(undefined);
    const [Avatar, setAvatar] = useState<File | undefined>(undefined);
    const [Error, setError] = useState("");
    
    useEffect(() => {
        const getnickname = async () => {
          try {
            const res = await fetch(`http://localhost:8000/user/Nickname`, {
              method: "GET",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
              const nickname : profileNickPic = await res.json();
              setAvatarImage(nickname.profilePic);
            }
          } catch (error) {
            setError('Error fetching data');
          }
        };
        getnickname();
      }, []);

      useEffect(() => {
        const IsQrEnabled = async () => {
          try {
            const res = await fetch(`http://localhost:8000/user/Nickname`, {
              method: "GET",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
              const nickname : profileNickPic = await res.json();
              setAvatarImage(nickname.profilePic);
            }
          } catch (error) {
            setError('Error fetching data');
          }
        };
        IsQrEnabled();
      }, []);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setBg(file);
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            try{
                const results = await fetch(`http://localhost:8000/upload/BackgroundPic`, {
                credentials: 'include',
                method: 'POST',
                body: formData,})
                if (results.ok){
                    setBgImage(URL.createObjectURL(file));
                }
                else {
                    console.log("error");
                    setError("Unable To change Picture Please try again");
                }
            } catch {
                setError("Internal error try again");
            }
        }
      };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const avatarFile = e.target.files?.[0];
        setAvatar(avatarFile);
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
                    setAvatarImage(URL.createObjectURL(avatarFile));
                }
                else {
                    console.log("error");
                    setError("Unable To change Picture Please try again");
                }
            } catch {
                setError("Internal error try again");
            }  
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
                    console.log("error");
                    setError("Unable To change Nickname Please try again");
                }
            } catch {
                setError("Internal error try again");
            }
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
        console.log("pass : ", passConfirmation)
        if (passConfirmation)
        {
            try{
                const results =  await axios.post("http://localhost:8000/user/pass", {password : passConfirmation}, {withCredentials : true});
                if (results.status === 201){
                    console.log("YYYYYYo")
                }
                else {
                    console.log("error");
                    setError("Unable To change Nickname Please try again");
                }
            } catch (error) {
                console.error(error.response.data.message[0]);
                setError(error.response.data.message[0]);
            }
        }
    }
    return (
        <main className="flex flex-col font-white bg-main overflow-y-hidden xl:h-screen mr-2">
            <TopBar />
            <div className="flex flex-col w-full h-[90%] justify-between">
                <div className="relative h-[30%] mt-10">
                    <div onClick={handleFileAdd} className="w-[95%] rounded-md relative h-full mx-auto">
                        <img alt="background" src={bgImage} className="w-full rounded-md h-full object-cover"/>
                        <label htmlFor="file"></label>
                        <input type="file" id="file" className="hidden" ref={fileRef} onChange={handleFileChange}/>
                        <div className="absolute right-10 -translate-x-1/2 -translate-y-1/2 text-[50px] rounded-full bg-white">
                            <PlusCircleIcon className="text-accents w-10 h-10" />
                        </div>
                    </div>
                    <div onClick={handleAvatarAdd} className="absolute bottom-10 left-10 w-[150px] h-[5%]">
                        <img alt="avatar" src={avatarImage} className="w-full rounded-full h-full max-w-[150px] max-h-[150px] min-h-[150px] min-w-[150px]"/>
                        <label htmlFor="file"></label>
                        <input type="file" id="file" className="hidden" ref={avatarRef} onChange={handleAvatarChange}/>
                        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-[50px] rounded-full bg-white">
                            <PlusCircleIcon className="text-accents w-10 h-10" />
                        </div>
                    </div>
                </div>
                <div className="flex border-2 border-gray-200 h-[55%] mt-20 rounded-lg">
                    <div className="flex xl:flex-row lg:flex-row md:flex-col flex-col p-10 justify-between w-full ">
                        <div className="flex flex-col w-[30%] p-5 mt-10 ml-10">
                            <div className="mb-6">
                                <label className="text-gray-500 w-[90%] text-md ml-10 mt-10 m-1">Change Nickname</label>
                                <input className="text-black w-[90%] rounded-lg" placeholder="Change Nickname..." type="text" onChange={AddNickname}></input>
                            </div>
                            <div className={`${newNick ? 'flex' : 'hidden'} mb-1`}>
                                <Button type="submit" radius="md" className={`block bg-gradient-to-tr from-accents to-back text-white shadow-lg 
                                    hover:from-accents hover:to-main hover:to-lightQuartzetext-white`} onClick={HandleNickChange}>
                                    save
                                </Button>
                            </div>
                            <div className="mb-6">
                                <label className="text-gray-500 w-[90%] text-md ml-10 m-1">Change Password</label>
                                <input className="text-black w-[90%] rounded-lg" placeholder="Change Password..." type="password" min={6} onChange={passChange}></input>
                            </div>
                            <div className="mb-2">
                                <label className="text-gray-500 w-[90%] text-md ml-10 m-1">Confirm Password</label>
                                <input className="text-black w-[90%] rounded-lg" placeholder="re-type your Password..." min={6} type="password" onChange={passconfirmation}></input>
                            </div>
                            <div className={`${passConfirmation ? 'flex' : 'hidden'} mb-1`}>
                                <Button type="submit" radius="md" className={`block bg-gradient-to-tr from-accents to-back text-white shadow-lg 
                                    hover:from-accents hover:to-main hover:to-lightQuartzetext-white`} onClick={HandlePassChange}>
                                    save
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col h-[40vh] w-[35%] p-3 mr-10 mt-10">
                            <div className="flex h-full justify-between">
                                <div className="text-white text-bold-300 text-lg">Enable 2FA </div>
                                <Switch
                                    checked={enabled}
                                    onChange={setEnabled}
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
                            <h3 className={`${enabled ? 'flex': "hidden"} text-red-400 text-md m-4`}>Please scan or disable QR code before leaving the page</h3>
                            <div className={`${enabled ? 'flex': "hidden"} border-2 border-accents w-full`} style={{ height: "auto", margin: "0 auto", maxWidth: 260, width: "100%" }}>
                                <QRCode
                                size={256}
                                style={{ height: "auto"}}
                                className="w-[70%] h-auto"
                                value={"455edfewq45fdsaf"}
                                viewBox={`0 0 256 256`}
                                />
                            </div>
                            <div className={`flex mt-4 mx-auto`}>
                                <Button radius="md" size="lg" className={`${enabled ? 'block' : 'hidden'} bg-gradient-to-tr from-accents to-back text-white shadow-lg 
                                    hover:from-accents hover:to-main hover:to-lightQuartzetext-white`} onClick={() => {}}>
                                    Enable
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