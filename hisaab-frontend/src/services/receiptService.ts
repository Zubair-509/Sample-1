import type { ExtractedReceipt } from '../types/transaction';

export class ReceiptExtractionError extends Error {
  userMessage: string;

  constructor(userMessage: string) {
    super(userMessage);
    this.name = 'ReceiptExtractionError';
    this.userMessage = userMessage;
  }
}

function getToken() {
  return localStorage.getItem('hisaab_token') ?? '';
}

export async function extractReceipt(image: File): Promise<ExtractedReceipt> {
  const formData = new FormData();
  formData.append('receipt', image);

  let response: Response;
  try {
    response = await fetch('/api/extract-receipt', {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    });
  } catch {
    throw new ReceiptExtractionError(
      'Could not reach AI — please try again or add manually',
    );
  }

  if (!response.ok) {
    let message = 'Could not reach AI — please try again or add manually';
    try {
      const body = await response.json();
      if (body?.userMessage) message = body.userMessage;
    } catch {
      // ignore parse error, use default message
    }
    throw new ReceiptExtractionError(message);
  }

  let data: ExtractedReceipt;
  try {
    data = await response.json();
  } catch {
    throw new ReceiptExtractionError(
      'AI could not read this receipt clearly — please add manually',
    );
  }

  return data;
}
