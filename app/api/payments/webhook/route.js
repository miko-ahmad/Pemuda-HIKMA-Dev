import prisma from '@/lib/prisma'
import midtransClient from 'midtrans-client'

export async function POST(request) {
  const body = await request.json()
  
  // Initialize Midtrans client
  const core = new midtransClient.Core({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
  })
  
  try {
    // Verify notification
    const statusResponse = await core.transaction.notification(body)
    const orderId = statusResponse.order_id
    const transactionStatus = statusResponse.transaction_status
    const fraudStatus = statusResponse.fraud_status
    
    // Extract ticket ID from order ID
    const ticketId = orderId.split('-')[1]
    
    if (transactionStatus === 'capture') {
      if (fraudStatus === 'challenge') {
        // Update ticket status to challenge
        await prisma.ticket.update({
          where: { id: ticketId },
          data: { status: 'CHALLENGE' }
        })
      } else if (fraudStatus === 'accept') {
        // Update ticket status to paid
        await prisma.ticket.update({
          where: { id: ticketId },
          data: { status: 'PAID' }
        })
      }
    } else if (transactionStatus === 'settlement') {
      // Update ticket status to paid
      await prisma.ticket.update({
        where: { id: ticketId },
        data: { status: 'PAID' }
      })
    } else if (transactionStatus === 'cancel' || 
               transactionStatus === 'deny' || 
               transactionStatus === 'expire') {
      // Update ticket status to failed
      await prisma.ticket.update({
        where: { id: ticketId },
        data: { status: 'FAILED' }
      })
    } else if (transactionStatus === 'pending') {
      // Update ticket status to pending
      await prisma.ticket.update({
        where: { id: ticketId },
        data: { status: 'PENDING' }
      })
    }
    
    return Response.json({ message: 'Webhook processed' })
  } catch (error) {
    console.error('Webhook error:', error)
    return Response.json({ message: 'Webhook failed' }, { status: 500 })
  }
}