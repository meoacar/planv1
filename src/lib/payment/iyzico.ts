// iyzico ödeme entegrasyonu
// Not: iyzipay paketini yüklemek için: npm install iyzipay

export interface IyzicoPaymentData {
  amount: number
  productId: string
  productName: string
  userId: string
  userEmail: string
  userName: string
  userPhone: string
  userAddress: string
  userCity: string
  userCountry: string
  callbackUrl: string
}

export async function createIyzicoPayment(data: IyzicoPaymentData) {
  try {
    // Admin panelinden ayarları al
    const { db } = await import('@/lib/db')
    const settings = await db.setting.findMany({
      where: {
        category: 'payment',
        key: {
          in: ['iyzicoApiKey', 'iyzicoSecretKey', 'iyzicoTestMode']
        }
      }
    })
    
    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value
      return acc
    }, {} as Record<string, string>)
    
    const apiKey = settingsMap.iyzicoApiKey || process.env.IYZICO_API_KEY
    const secretKey = settingsMap.iyzicoSecretKey || process.env.IYZICO_SECRET_KEY
    const isTestMode = settingsMap.iyzicoTestMode === 'true'
    
    if (!apiKey || !secretKey) {
      throw new Error('iyzico API bilgileri bulunamadı')
    }

    const Iyzipay = require('iyzipay')
    
    const iyzipay = new Iyzipay({
      apiKey: apiKey,
      secretKey: secretKey,
      uri: isTestMode ? 'https://sandbox-api.iyzipay.com' : 'https://api.iyzipay.com',
    })

    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: `${data.userId}-${Date.now()}`,
      price: data.amount.toFixed(2),
      paidPrice: data.amount.toFixed(2),
      currency: Iyzipay.CURRENCY.TRY,
      basketId: data.productId,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: data.callbackUrl,
      enabledInstallments: [1],
      buyer: {
        id: data.userId,
        name: data.userName.split(' ')[0] || 'Ad',
        surname: data.userName.split(' ')[1] || 'Soyad',
        gsmNumber: data.userPhone || '+905555555555',
        email: data.userEmail,
        identityNumber: '11111111111',
        registrationAddress: data.userAddress || 'Adres',
        ip: '85.34.78.112',
        city: data.userCity || 'Istanbul',
        country: data.userCountry || 'Turkey',
      },
      shippingAddress: {
        contactName: data.userName,
        city: data.userCity || 'Istanbul',
        country: data.userCountry || 'Turkey',
        address: data.userAddress || 'Adres',
      },
      billingAddress: {
        contactName: data.userName,
        city: data.userCity || 'Istanbul',
        country: data.userCountry || 'Turkey',
        address: data.userAddress || 'Adres',
      },
      basketItems: [
        {
          id: data.productId,
          name: data.productName,
          category1: 'Premium',
          itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
          price: data.amount.toFixed(2),
        },
      ],
    }

    return new Promise((resolve, reject) => {
      iyzipay.checkoutFormInitialize.create(request, (err: any, result: any) => {
        if (err) {
          reject(err)
        } else {
          resolve({
            success: true,
            paymentPageUrl: result.paymentPageUrl,
            token: result.token,
          })
        }
      })
    })
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    }
  }
}

export async function verifyIyzicoPayment(token: string) {
  try {
    // Admin panelinden ayarları al
    const { db } = await import('@/lib/db')
    const settings = await db.setting.findMany({
      where: {
        category: 'payment',
        key: {
          in: ['iyzicoApiKey', 'iyzicoSecretKey', 'iyzicoTestMode']
        }
      }
    })
    
    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value
      return acc
    }, {} as Record<string, string>)
    
    const apiKey = settingsMap.iyzicoApiKey || process.env.IYZICO_API_KEY
    const secretKey = settingsMap.iyzicoSecretKey || process.env.IYZICO_SECRET_KEY
    const isTestMode = settingsMap.iyzicoTestMode === 'true'
    
    if (!apiKey || !secretKey) {
      throw new Error('iyzico API bilgileri bulunamadı')
    }

    const Iyzipay = require('iyzipay')
    
    const iyzipay = new Iyzipay({
      apiKey: apiKey,
      secretKey: secretKey,
      uri: isTestMode ? 'https://sandbox-api.iyzipay.com' : 'https://api.iyzipay.com',
    })

    const request = {
      locale: Iyzipay.LOCALE.TR,
      token: token,
    }

    return new Promise((resolve, reject) => {
      iyzipay.checkoutForm.retrieve(request, (err: any, result: any) => {
        if (err) {
          reject(err)
        } else {
          resolve({
            success: true,
            status: result.status,
            paymentStatus: result.paymentStatus,
            conversationId: result.conversationId,
          })
        }
      })
    })
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    }
  }
}
