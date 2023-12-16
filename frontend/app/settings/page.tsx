'use client'

import { PlusCircleIcon } from "@heroicons/react/24/outline";
import TopBar from "../ui/top";
import QRCode from 'qrcode.react';
import { Switch } from '@headlessui/react'
import { useState } from "react";
import { Button } from "@nextui-org/react";
// import withAuth from "../withAuth"

const settings = () => {

    const [enabled, setEnabled] = useState(false);
    const [newnick, setNewNick] = useState<string | null> (null);
    const [pass, setPass] = useState<number | null>(null);
    const [Qr, setQr] = useState<string | null>(null);

    return (
        <main className="flex flex-col font-white bg-main overflow-y-hidden xl:h-screen mr-2">
            <TopBar />
            <div className="flex flex-col w-full h-[90%] justify-between">
                <div className="relative h-[30%] mt-10">
                    <div className="w-[95%] rounded-md relative h-full mx-auto">
                        <img src="./yo.jpg" className=" w-full rounded-md h-full" />
                        <label htmlFor="file"></label>
                        <input type="file" id="file" className="hidden" />
                        <div className="absolute right-10 -translate-x-1/2 -translate-y-1/2 text-[50px] rounded-full bg-white">
                            <PlusCircleIcon className="text-accents w-10 h-10" />
                        </div>
                    </div>
                    <div className="absolute bottom-10 left-10 w-[150px] h-[5%]">
                        <img src="./yo.jpg" className="rounded-full w-[150px]" />
                        <label htmlFor="file"></label>
                        <input type="file" id="file" className="hidden" />
                        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-[50px] rounded-full bg-white">
                            <PlusCircleIcon className="text-accents w-10 h-10" />
                        </div>
                    </div>
                </div>
                <div className="flex border-2 border-gray-200 h-[55%] mt-20 rounded-lg">
                    <div className="flex flex-row p-10 justify-between w-full ">
                        <div className="flex flex-col w-[30%] p-5 mt-10 ml-10">
                            <div className="mb-6">
                                <label className="text-gray-500 w-[90%] text-md ml-10 mt-10 m-1">Change Nickname</label>
                                <input className="text-black w-[90%] rounded-lg" placeholder="Change Nickname..." color="" type="text" onChange={(e) => {setNewNick(e.target.value)}} ></input>
                            </div>
                            <div className={`${newnick ? 'flex' : 'hidden'} mb-1`}>
                                <Button radius="md" className={`block bg-gradient-to-tr from-accents to-back text-white shadow-lg 
                                    hover:from-accents hover:to-main hover:to-lightQuartzetext-white`} onClick={() => {}}>
                                    save
                                </Button>
                            </div>
                            <div className="mb-6">
                                <label className="text-gray-500 w-[90%] text-md ml-10 m-1">Change Password</label>
                                <input className="text-black w-[90%] rounded-lg" placeholder="Change Password..." type="password" min={6} onChange={() => {setPass(1)}}></input>
                            </div>
                            <div className="mb-2">
                                <label className="text-gray-500 w-[90%] text-md ml-10 m-1">Confirm Password</label>
                                <input className="text-black w-[90%] rounded-lg" placeholder="re-type your Password..." min={6} type="password" ></input>
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