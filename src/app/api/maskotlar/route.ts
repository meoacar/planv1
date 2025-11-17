import { NextResponse } from 'next/server'
import { readdir } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  try {
    const maskotDir = join(process.cwd(), 'public', 'maskot')
    const files = await readdir(maskotDir)
    
    // Filter only numbered maskot files (1.png, 2.png, etc.)
    const imageFiles = files.filter(file => 
      /^\d+\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    )
    
    // Create URLs for each maskot
    const maskots = imageFiles.map(file => ({
      id: file.replace(/\.[^/.]+$/, ''), // filename without extension
      url: `/maskot/${file}`,
      name: `Maskot ${file.replace(/\.[^/.]+$/, '')}`
    }))
    
    return NextResponse.json({ success: true, data: maskots })
  } catch (error) {
    console.error('Maskot loading error:', error)
    return NextResponse.json(
      { success: false, error: 'Maskotlar yüklenemedi' },
      { status: 500 }
    )
  }
}
