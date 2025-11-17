import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'ZayiflamaPlan'
    const author = searchParams.get('author') || ''
    const result = searchParams.get('result') || ''

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Decorative circles */}
          <div
            style={{
              position: 'absolute',
              top: -50,
              left: -50,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -100,
              right: -100,
              width: 400,
              height: 400,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
            }}
          />

          {/* Main card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '90%',
              height: '80%',
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.98), rgba(248,250,252,0.98))',
              borderRadius: 32,
              padding: 60,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            {/* Icon */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 40,
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: '#667eea',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 48,
                }}
              >
                🎯
              </div>
            </div>

            {/* Title */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'center',
              }}
            >
              <h1
                style={{
                  fontSize: title.length > 40 ? 48 : 64,
                  fontWeight: 'bold',
                  color: '#1e293b',
                  margin: 0,
                  lineHeight: 1.2,
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {title}
              </h1>
            </div>

            {/* Author and Result */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#f1f5f9',
                borderRadius: 16,
                padding: '24px 32px',
                marginTop: 40,
              }}
            >
              {author && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 28,
                    color: '#64748b',
                  }}
                >
                  <span style={{ marginRight: 12 }}>👤</span>
                  {author}
                </div>
              )}
              {result && (
                <div
                  style={{
                    background: '#10b981',
                    color: 'white',
                    padding: '16px 32px',
                    borderRadius: 30,
                    fontSize: 32,
                    fontWeight: 'bold',
                  }}
                >
                  {result}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 40,
              }}
            >
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 'bold',
                  color: '#667eea',
                }}
              >
                ZayiflamaPlan
              </div>
              <div
                style={{
                  fontSize: 24,
                  color: '#94a3b8',
                }}
              >
                Gerçek İnsanların Gerçek Planları
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.error('OG Image generation error:', e)
    return new Response(`Failed to generate image: ${e.message}`, {
      status: 500,
    })
  }
}
