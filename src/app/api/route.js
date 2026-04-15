import { NextResponse } from "next/server"

async function chamarIA(text) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=AIzaSyCs_RjCSRp3rCJgs7UXuDfaqTxu642ae0w`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text }]
          }
        ]
      })
    }
  )

  const res = await response.json()

  return { ok: response.ok, res }
}

export async function POST(req) {
  try {
    const data = await req.json()
    const text = data.data

    let tentativa = 0

    while (tentativa < 3) {
      const { ok, res } = await chamarIA(text)

      // ✅ sucesso
      if (ok && !res.error) {
        return NextResponse.json({ data: res })
      }

      // 🔁 erro de alta demanda → tenta de novo
      if (res.error?.message?.includes("high demand")) {
        tentativa++
        await new Promise(r => setTimeout(r, 1000))
        continue
      }

      // ❌ outro erro
      return NextResponse.json(
        { error: res.error?.message || "Erro na IA" },
        { status: 500 }
      )
    }

    // ❌ falhou 3 vezes
    return NextResponse.json(
      { error: "IA muito ocupada, tente novamente 😅" },
      { status: 500 }
    )

  } catch (err) {
    return NextResponse.json(
      { error: "Erro no servidor" },
      { status: 500 }
    )
  }
}