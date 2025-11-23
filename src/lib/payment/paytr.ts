// PayTR ödeme entegrasyonu
import crypto from 'crypto'

export interface PayTRPaymentData {
  amount: number
  productId: string
  productName: string
  userId: string
  userEmail: string
  userName: string
  userPhone: string
  userAddress: string
  merchantOid: string
  successUrl: string
  failUrl: string
}

export async function createPayTRPayment(data: PayTRPaymentData) {
  try {
    if (!process.env.PAYTR_MERCHANT_ID || !process.env.PAYTR_MERCHANT_KEY || !process.env.PAYTR_MERCHANT_SALT) {
      throw new Error('PayTR API bilgileri bulunamadı')
    }

    const merchantId = process.env.PAYTR_MERCHANT_ID
    const merchantKey = process.env.PAYTR_MERCHANT_KEY
    const merchantSalt = process.env.PAYTR_MERCHANT_SALT

    // PayTR için gerekli parametreler
    const merchantOid = data.merchantOid
    const email = data.userEmail
    const paymentAmount = Math.round(data.amount * 100) // Kuruş cinsinden
    const userBasket = Buffer.from(JSON.stringify([
      [data.productName, data.amount.toFixed(2), 1]
    ])).toString('base64')
    
    const userIp = '85.34.78.112' // Gerçek IP'yi request'ten almalısınız
    const noInstallment = '1'
    const maxInstallment = '0'
    const currency = 'TL'
    const testMode = process.env.PAYTR_TEST_MODE === 'true' ? '1' : '0'

    // Hash oluşturma
    const hashStr = `${merchantId}${userIp}${merchantOid}${email}${paymentAmount}${userBasket}${noInstallment}${maxInstallment}${currency}${testMode}`
    const paytrToken = hashStr + merchantSalt
    const token = crypto.createHmac('sha256', merchantKey).update(paytrToken).digest('base64')

    // PayTR'ye gönderilecek form data
    const formData = {
      merchant_id: merchantId,
      user_ip: userIp,
      merchant_oid: merchantOid,
      email: email,
      payment_amount: paymentAmount.toString(),
      user_basket: userBasket,
      no_installment: noInstallment,
      max_installment: maxInstallment,
      user_name: data.userName,
      user_address: data.userAddress,
      user_phone: data.userPhone,
      merchant_ok_url: data.successUrl,
      merchant_fail_url: data.failUrl,
      timeout_limit: '30',
      debug_on: testMode,
      test_mode: testMode,
      lang: 'tr',
      currency: currency,
      paytr_token: token,
    }

    // PayTR API'sine POST isteği
    const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(formData as any).toString(),
    })

    const result = await response.json()

    if (result.status === 'success') {
      return {
        success: true,
        token: result.token,
        paymentUrl: `https://www.paytr.com/odeme/guvenli/${result.token}`,
      }
    } else {
      return {
        success: false,
        error: result.reason || 'PayTR ödeme oluşturulamadı',
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    }
  }
}

export async function verifyPayTRCallback(postData: any) {
  try {
    if (!process.env.PAYTR_MERCHANT_KEY || !process.env.PAYTR_MERCHANT_SALT) {
      throw new Error('PayTR API bilgileri bulunamadı')
    }

    const merchantKey = process.env.PAYTR_MERCHANT_KEY
    const merchantSalt = process.env.PAYTR_MERCHANT_SALT

    // PayTR'den gelen hash kontrolü
    const hash = postData.hash
    const merchantOid = postData.merchant_oid
    const status = postData.status
    const totalAmount = postData.total_amount

    const hashStr = merchantOid + merchantSalt + status + totalAmount
    const calculatedHash = crypto.createHmac('sha256', merchantKey).update(hashStr).digest('base64')

    if (hash !== calculatedHash) {
      return {
        success: false,
        error: 'Hash doğrulaması başarısız',
      }
    }

    return {
      success: true,
      status: status,
      merchantOid: merchantOid,
      totalAmount: totalAmount,
      paid: status === 'success',
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    }
  }
}
