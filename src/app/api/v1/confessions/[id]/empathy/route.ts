import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { addEmpathy, removeEmpathy } from '@/services/confession.service';

// POST /api/v1/confessions/[id]/empathy - Empati ekle
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Giriş yapmalısınız',
          },
        },
        { status: 401 }
      );
    }

    const result = await addEmpathy(id, session.user.id);

    return NextResponse.json({
      success: true,
      data: {
        empathyCount: result.empathyCount,
        xpEarned: 2,
      },
      message: 'Empati gösterdin! +2 XP kazandın',
    });
  } catch (error: any) {
    console.error('Add empathy error:', error);

    if (error.message.includes('bulunamadı')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'CONFESSION_NOT_FOUND',
            message: error.message,
          },
        },
        { status: 404 }
      );
    }

    if (error.message.includes('zaten empati')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'ALREADY_EMPATHIZED',
            message: error.message,
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'ADD_EMPATHY_ERROR',
          message: error.message || 'Empati eklenirken hata oluştu',
        },
      },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/confessions/[id]/empathy - Empatiyi kaldır
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Giriş yapmalısınız',
          },
        },
        { status: 401 }
      );
    }

    const result = await removeEmpathy(id, session.user.id);

    return NextResponse.json({
      success: true,
      data: {
        empathyCount: result.empathyCount,
      },
      message: 'Empati kaldırıldı',
    });
  } catch (error: any) {
    console.error('Remove empathy error:', error);

    if (error.message.includes('bulunamadı')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'EMPATHY_NOT_FOUND',
            message: error.message,
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'REMOVE_EMPATHY_ERROR',
          message: error.message || 'Empati kaldırılırken hata oluştu',
        },
      },
      { status: 500 }
    );
  }
}
