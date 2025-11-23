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
    if (!process.env.IYZICO_API_KEY || !process.env.IYZICO_SECRET_KEY) {
      throw new Error('iyzico API bilgileri bulunamadı')
    }

    // const Iyzipay = require('iyzipay')
    
    // const iyzipay = new Iyzipay({
    //   apiKey: process.env.IYZICO_API_KEY,
    //   secretKey: process.env.IYZICO_SECRET_KEY,
    //   uri: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com', // sandbox veya production
    // })

    // const request = {
    //   locale: Iyzipay.LOCALE.TR,
    //   conversationId: `${data.userId}-${Date.now()}`,
    //   price: data.amount.toFixed(2),
    //   paidPrice: data.amount.toFixed(2),
    //   currency: Iyzipay.CURRENCY.TRY,
    //   basketId: data.productId,
    //   paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    //   callbackUrl: data.callbackUrl,
    //   enabledInstallments: [1],
    //   buyer: {
    //     id: data.userId,
    //     name: data.userName.split(' ')[0] || 'Ad',
    //     surname: data.userName.split(' ')[1] || 'Soyad',
    //     gsmNumber: data.userPhone || '+905555555555',
    //     email: data.userEmail,
    //     identityNumber: '11111111111',
    //     registrationAddress: data.userAddress || 'Adres',
    //     ip: '85.34.78.112',
    //     city: data.userCity || 'Istanbul',
    //     country: data.userCountry || 'Turkey',
    //   },
    //   shippingAddress: {
    //     contactName: data.userName,
    //     city: data.userCity || 'Istanbul',
    //     country: data.userCountry || 'Turkey',
    //     address: data.userAddress || 'Adres',
    //   },
    //   billingAddress: {
    //     contactName: data.userName,
    //     city: data.userCity || 'Istanbul',
    //     country: data.userCountry || 'Turkey',
    //     address: data.userAddress || 'Adres',
    //   },
    //   basketItems: [
    //     {
    //       id: data.productId,
    //       name: data.productName,
    //       category1: 'Premium',
    //       itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
    //       price: data.amount.toFixed(2),
    //     },
    //   ],
    // }

    // return new Promise((resolve, reject) => {
    //   iyzipay.checkoutFormInitialize.create(request, (err: any, result: any) => {
    //     if (err) {
    //       reject(err)
    //     } else {
    //       resolve({
    //         success: true,
    //         paymentPageUrl: result.paymentPageUrl,
    //         token: result.token,
    //       })
    //     }
    //   })
    // })

    return {
      success: false,
      error: 'iyzico entegrasyonu henüz aktif değil. Lütfen IYZICO_API_KEY ve IYZICO_SECRET_KEY ekleyin.',
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    }
  }
}

export async function verifyIyzicoPayment(token: string) {
  try {
    if (!process.env.IYZICO_API_KEY || !process.env.IYZICO_SECRET_KEY) {
      throw new Error('iyzico API bilgileri bulunamadı')
    }

    // const Iyzipay = require('iyzipay')
    
    // const iyzipay = new Iyzipay({
    //   apiKey: process.env.IYZICO_API_KEY,
    //   secretKey: process.env.IYZICO_SECRET_KEY,
    //   uri: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com',
    // })

    // const request = {
    //   locale: Iyzipay.LOCALE.TR,
    //   token: token,
    // }

    // return new Promise((resolve, reject) => {
    //   iyzipay.checkoutForm.retrieve(request, (err: any, result: any) => {
    //     if (err) {
    //       reject(err)
    //     } else {
    //       resolve({
    //         success: true,
    //         status: result.status,
    //         paymentStatus: result.paymentStatus,
    //         conversationId: result.conversationId,
    //       })
    //     }
    //   })
    // })

    return {
      success: false,
      error: 'iyzico entegrasyonu henüz aktif değil',
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    }
  }
}
