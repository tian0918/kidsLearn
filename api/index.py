import os
import uuid
import edge_tts
from fastapi import FastAPI, HTTPException, Query
package_version = "0.1.0"
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import certifi

os.environ['SSL_CERT_FILE'] = certifi.where()

app = FastAPI(title="Edge TTS Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],   # 允许所有方法（GET, POST, OPTIONS 等）
    allow_headers=["*"],   # 允许所有 headers
)


@app.get("/api/stream-audio")
async def stream_audio(
  text: str = Query(..., description="Text to convert to speech"),
  voice: str = Query("en-US-AvaNeural", description="Voice name")
):
  async def audio_generator():
    communicate = edge_tts.Communicate(text, voice)
    async for chunk in communicate.stream():
      if chunk["type"] == "audio":
        yield chunk["data"]
    
  return StreamingResponse(audio_generator(), media_type="audio/mpeg")
@app.get("/api/voices")
async def list_all_voice():
  voices = await edge_tts.VoicesManager.create()
  return voices.voices

@app.get("/api/voices/{lang}")
async def list_voice(
  lang:str
):
  voices = await edge_tts.VoicesManager.create()
  filterList = []
  if lang:
    filterList  = [item for item in voices.voices if item["Language"] == lang ]
  else:
    filterList = voices.voices
  return filterList

# if __name__ == "__main__":
#   import uvicorn
#   uvicorn.run(app, host="0.0.0.0", port=8964)