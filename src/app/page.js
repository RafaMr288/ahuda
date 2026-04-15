'use client'

import "./style.css"
import {useState} from "react"

export default function Home() {

  const [text, setText] = useState("")
  const [active, setActive] = useState(false)
  const [chat, setChat] = useState([])

  async function enviar() {
    if(text == ""){
      return
    }

    const newChat1 = [0,text]
    setChat(prev => [...prev, newChat1])
    console.log(chat)
    return
    try {
      const res = await fetch("./api", {
        method:"POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify({data:text})
      })
  
      const data = await res.json()
      const t = data.data.candidates[0].content.parts[0].text
      const newChat2 = [1,t]
  
      setChat(prev => [...prev, newChat2])
      return
    }
    catch {
      setChat(prev => [...prev, [2, 'error no req com AHUDA']])
      return
    }

  }

  return (
    <div className="content">
      <div className="top">
        <h1>AHUDA</h1>
      </div>
      <div className="center">
        {chat.map((item, index) => {
          if(item[0] == 0){
            return (
              <div className="user" key={index}>
                <h3>{item[1]}</h3>
              </div>
            )
          }
          if(item[0] == 1) {
            return (
              <div key={index}>
                <h3>{item[1]}</h3>
              </div>
            )
          }
          if(item[0] == 2) {
            return (
            <div key={index} style={{backgroundColor:"rgba(255, 85, 85, 0.95)", paddingLeft:2}}>
                <h3>{item[1]}</h3>
              </div>
          )}
        })}
      </div>
      <div className="bottom">
        <input placeholder="digite aqui"
        value={text}
        onChange={e => setText(e.target.value)}
        ></input>
        <button onClick={() => enviar()} disabled={active}>enviar</button>
      </div>
    </div>
  )

}