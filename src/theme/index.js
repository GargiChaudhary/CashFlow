import { createTheme } from "@mui/material";
import '@fontsource/poppins';

// Green (#4CAF50): Represents money, growth, and trust. Use it for buttons, highlights, and headers.
// Dark Blue (#2C3E50): For the navbar, main text, and footer—it conveys professionalism and stability.
// Light Gray (#F4F4F4): For backgrounds to keep it minimal and clean.
// White (#FFFFFF): For content sections to ensure readability.
// Golden Accent (#F1C40F): For small highlights like icons or alert messages, adding a premium touch.
// Navbar and Footer: Dark Blue
// Buttons: Green (hover effect with a darker green)
// Background: Light Gray with white for cards or input forms.
// Important Highlights: Golden for outstanding amounts or key notices.

const theme = createTheme({
    palette: {
        primary: {
            main: '#2C3E50' //#4CAF50 --> green, #2C3E50 --> navy blue
        },
        secondary: {
            main: '#f4f4f4'
        }
    },
    typography: {
        fontFamily: `'Poppins', 'Helvetica', 'Arial'`
    }
});

export default theme;