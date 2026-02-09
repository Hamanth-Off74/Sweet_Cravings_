# Voice Ordering Feature - Setup Guide

## Overview
The voice ordering feature allows users to place dessert orders using speech. The system records audio in the browser, sends it to the backend, transcribes it using AssemblyAI, and automatically adds detected dessert items to the shopping cart.

---

## Features

✅ **Real-time Voice Recording** - Uses MediaRecorder API to capture audio in the browser
✅ **Speech-to-Text Transcription** - Powered by AssemblyAI for accurate transcription
✅ **Smart Item Detection** - Intelligent parsing to identify dessert items and quantities
✅ **Automatic Cart Addition** - Detected items are automatically added to the shopping cart
✅ **User-Friendly Interface** - Beautiful UI with recording indicators and result displays
✅ **Error Handling** - Comprehensive error messages for better user experience

---

## Architecture

```
User Browser                     Backend Server              AssemblyAI API
    |                                 |                           |
    | 1. Record Audio                 |                           |
    |-----(MediaRecorder API)         |                           |
    |                                 |                           |
    | 2. Send Audio File              |                           |
    |-------------------------------->|                           |
    |       (POST /api/voice-order)   |                           |
    |                                 | 3. Upload Audio           |
    |                                 |-------------------------->|
    |                                 |                           |
    |                                 | 4. Transcription Result   |
    |                                 |<--------------------------|
    |                                 |                           |
    |                                 | 5. Parse Dessert Items    |
    |                                 |    (using desserts array) |
    |                                 |                           |
    | 6. Return Detected Items        |                           |
    |<--------------------------------|                           |
    |                                 |                           |
    | 7. Add Items to Cart            |                           |
    |-----(CartContext)               |                           |
```

---

## Setup Instructions

### 1. Get AssemblyAI API Key

1. Visit [AssemblyAI Website](https://www.assemblyai.com/)
2. Sign up for a free account
3. Navigate to your dashboard
4. Copy your API key

### 2. Configure Environment Variables

1. Create a `.env` file in the root directory (if it doesn't exist)
2. Add your AssemblyAI API key:

```env
# AssemblyAI Configuration
ASSEMBLYAI_KEY=your_actual_assemblyai_api_key_here
```

3. Make sure other required environment variables are also set:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/sweetcravings

# Server Configuration
PORT=5000

# AssemblyAI Configuration
ASSEMBLYAI_KEY=your_actual_assemblyai_api_key_here
```

### 3. Install Dependencies

All required packages should already be installed. If not, run:

```bash
npm install assemblyai multer
```

### 4. Start the Application

**Backend:**
```bash
npm start
```

**Frontend:**
```bash
cd client
npm run dev
```

---

## Usage Instructions

### For Users:

1. **Navigate to Menu Page** - Go to the dessert menu/products page
2. **Find Voice Order Section** - Look for the purple gradient "Voice Order" section
3. **Click "Start Recording"** - Grant microphone permissions when prompted
4. **Speak Your Order** - Clearly say the desserts you want, for example:
   - "I want two chocolate cakes and one vanilla ice cream"
   - "Three brownies and a cheesecake please"
   - "One tiramisu"
5. **Click "Stop & Process"** - The system will transcribe and process your order
6. **Review Results** - See what was detected and check your cart

### Example Voice Commands:

- "Two chocolate cakes and one vanilla ice cream"
- "I'd like three brownies please"
- "One tiramisu and two cannoli"
- "Give me a red velvet cake"
- "I want five cookies and a pie"

---

## Technical Details

### Backend Components

#### Route: `/api/voice-order`
- **Method:** POST
- **Content-Type:** multipart/form-data
- **Input:** Audio file (WebM format)
- **Process:**
  1. Receives audio file via multer
  2. Uploads to AssemblyAI for transcription
  3. Parses transcription for dessert names and quantities
  4. Returns detected items
- **Output:**
```json
{
  "success": true,
  "transcription": "I want two chocolate cakes and one vanilla ice cream",
  "items": [
    {
      "_id": "1",
      "name": "Chocolate Cake",
      "price": 180.00,
      "quantity": 2,
      "imageURL": "/images/cakes/chocolate-cake.jpg"
    },
    {
      "_id": "31",
      "name": "Vanilla Bean Ice Cream",
      "price": 120.00,
      "quantity": 1,
      "imageURL": "..."
    }
  ],
  "message": "Found 2 items: 2x Chocolate Cake, 1x Vanilla Bean Ice Cream",
  "confidence": 0.95
}
```

#### Parsing Algorithm (`parseDessertOrder` function)
- Converts transcription to lowercase for matching
- Splits text into phrases using punctuation and conjunctions
- Matches dessert names using full-name and partial-word matching
- Extracts quantities from numeric values (1-20) and word forms (one, two, etc.)
- Returns array of detected items with quantities

### Frontend Components

#### VoiceOrder Component (`client/src/components/VoiceOrder.jsx`)
**State Variables:**
- `isRecording` - Whether audio is currently being recorded
- `isProcessing` - Whether the audio is being transcribed
- `transcription` - The transcribed text from AssemblyAI
- `message` - Success/info message
- `error` - Error message (if any)
- `detectedItems` - Array of detected dessert items

**Key Functions:**
- `startRecording()` - Requests microphone access and starts recording
- `stopRecording()` - Stops recording and processes audio
- `processAudioOrder()` - Sends audio to backend API
- `cancelRecording()` - Cancels recording without processing

**MediaRecorder Configuration:**
```javascript
{
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    sampleRate: 44100
  }
}
```

---

## File Structure

```
sweet cravings/
├── routes/
│   └── index.js                    # Backend routes (includes /api/voice-order)
├── uploads/                        # Temporary audio file storage
├── client/
│   └── src/
│       ├── components/
│       │   └── VoiceOrder.jsx     # Voice ordering component
│       ├── styles/
│       │   └── VoiceOrder.css     # Voice ordering styles
│       └── pages/
│           └── Menu.jsx           # Menu page (includes VoiceOrder)
├── .env                           # Environment variables (not in repo)
├── .env.example                   # Example environment variables
└── VOICE_ORDERING_GUIDE.md       # This file
```

---

## Supported Desserts

The system can detect the following desserts (35 items total):

**Cakes:** Chocolate Cake, Red Velvet Cake, Black Forest Cake, Cheesecake, Pineapple Pastry Cake

**Cookies:** Chocolate Chip Cookie, Oatmeal Raisin Cookie, Double Chocolate Cookie, Peanut Butter Cookie, Sugar Cookie

**Pies:** Blueberry Pie, Cherry Pie, Banoffee Pie, Chocolate Cream Pie, Key Lime Pie

**Italian:** Tiramisu, Cannoli, Panna Cotta, Zeppole, Biscotti

**Brownies:** Fudgy Chocolate Brownie, Walnut Brownie, Salted Caramel Brownie, Blondie, Cream Cheese Brownie

**Tarts:** Lemon Tart, Chocolate Tart, Fruit Tart, Custard Tart, Caramel Tart

**Ice Cream:** Vanilla Bean Ice Cream, Chocolate Fudge Brownie Ice Cream, Strawberry Cheesecake Ice Cream, Mint Chocolate Chip Ice Cream, Cookie Dough Ice Cream

---

## Tips for Best Results

### For Users:
- Speak clearly and at a normal pace
- Mention quantities explicitly (e.g., "two", "three")
- Use full dessert names when possible
- Minimize background noise
- Keep recordings under 30 seconds for faster processing

### For Developers:
- The `uploads/` directory is for temporary storage and should be in `.gitignore`
- Audio files are automatically deleted after processing
- The parsing algorithm uses fuzzy matching for flexibility
- Consider adding rate limiting to prevent API abuse
- Monitor AssemblyAI API usage to stay within free tier limits

---

## Troubleshooting

### "No audio file provided" error
- Check that the browser supports MediaRecorder API
- Ensure microphone permissions are granted
- Try using a different browser (Chrome/Edge recommended)

### "ASSEMBLYAI_KEY not configured" error
- Verify `.env` file exists in root directory
- Check that `ASSEMBLYAI_KEY` is set correctly
- Restart the backend server after adding the key

### "Failed to process voice order" error
- Check internet connection
- Verify AssemblyAI API key is valid
- Check console logs for detailed error messages
- Ensure audio file is not corrupted

### No items detected
- Speak more clearly with less background noise
- Use full dessert names (e.g., "chocolate cake" not just "chocolate")
- Check that the desserts you're ordering are in the menu
- Try speaking slower with pauses between items

### Microphone not working
- Check browser permissions (Settings > Privacy > Microphone)
- Ensure no other application is using the microphone
- Try refreshing the page and granting permissions again
- Test microphone in other applications to verify it works

---

## API Rate Limits

**AssemblyAI Free Tier:**
- 3 hours of audio per month
- No credit card required for free tier
- Typical 10-second order uses ~0.003 hours

**Estimated Usage:**
- ~1000 voice orders per month on free tier
- Consider paid plan for production use

---

## Security Considerations

1. **Environment Variables:** Never commit `.env` file with actual API keys
2. **File Upload Limits:** Multer is configured with 10MB limit to prevent abuse
3. **Temporary Files:** Audio files are deleted immediately after processing
4. **API Key Protection:** AssemblyAI key is only used on backend, never exposed to frontend
5. **Input Validation:** Backend validates audio file existence before processing

---

## Future Enhancements

- [ ] Add support for order modifications ("add more", "remove")
- [ ] Implement multi-language support
- [ ] Add voice confirmation before adding to cart
- [ ] Store previous voice orders for quick reorder
- [ ] Add analytics for most voice-ordered items
- [ ] Implement real-time transcription preview
- [ ] Add support for special instructions ("no sugar", "extra cream")
- [ ] Integrate with user accounts for personalized suggestions

---

## Dependencies

**Backend:**
- `assemblyai` - Speech-to-text transcription
- `multer` - File upload handling
- `express` - Web framework
- `fs/promises` - File system operations

**Frontend:**
- `react` - UI framework
- `axios` - HTTP client
- MediaRecorder API - Browser audio recording

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review console logs for detailed error messages
3. Verify all environment variables are set correctly
4. Check AssemblyAI dashboard for API status

---

## License

This feature is part of the Sweet Cravings dessert ordering system.

---

**Last Updated:** December 22, 2025
**Version:** 1.0.0
**Status:** Production Ready ✅
