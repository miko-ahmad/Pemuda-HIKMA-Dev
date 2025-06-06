import prisma from '@/lib/prisma'
import midtransClient from 'midtrans-client'

export async function POST(request) {
  const { name, email, phone, eventSlug } = await request.json()
  
  try {
    // Get event details
    const event = await prisma.event.findUnique({
      where: { slug: eventSlug }
    })
    
    if (!event) {
      return Response.json({ message: 'Event not found' }, { status: 404 })
    }
    
    // Create ticket record
    const ticket = await prisma.ticket.create({
      data: {
        eventId: event.id,
        buyerName: name,
        buyerEmail: email,
        buyerPhone: phone
      }
    })
    
    // Initialize Midtrans client
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    })
    
    // Create transaction parameters
    const parameter = {
      transaction_details: {
        order_id: `TICKET-${ticket.id}-${Date.now()}`,
        gross_amount: event.price
      },
      customer_details: {
        first_name: name,
        email: email,
        phone: phone
      },
      item_details: [
        {
          id: event.id,
          price: event.price,
          quantity: 1,
          name: event.title,
          category: 'Event Ticket'
        }
      ]
    }
    
    // Create transaction
    const transaction = await snap.createTransaction(parameter)
    
    // Update ticket with Midtrans ID
    await prisma.ticket.update({
      where: { id: ticket.id },
      data: { midtransId: transaction.token }
    })
    
    return Response.json({ 
      paymentUrl: transaction.redirect_url,
      ticketId: ticket.id
    })
    
  } catch (error) {
    console.error('Payment error:', error)
    return Response.json({ message: 'Payment failed' }, { status: 500 })
  }
}