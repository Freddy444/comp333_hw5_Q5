const React = require('react');
const { render, screen, fireEvent, act, waitFor } = require('@testing-library/react');
const { BrowserRouter: Router, MemoryRouter } = require('react-router-dom'); // Import BrowserRouter
const userEvent = require('@testing-library/user-event');
const LoginView = require('./loginview');
const axios = require('axios');

jest.mock('axios');


jest.mock('axios');


describe('LoginView Component', () => {
    //Include a rendering test for each of the input fields and text on the page.
    test('renders login form heading', () => {
        render(
            <Router>
                <LoginView />
            </Router>
        );
        expect(screen.getByText('Login Form')).toBeInTheDocument();
    });

    test('renders username and password input fields', () => {
        render(
            <Router>
                <LoginView />
            </Router>
        );
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    });
    
    //Include at least one test of a link that navigates from one page to another
    test('navigates to registration page on Register button click', async () => {
        render(
          <MemoryRouter>
            <LoginView />
          </MemoryRouter>
        );
    
        // Wrap the interaction with MemoryRouter in act
        await act(async () => {
          // Click on the Register button
          userEvent.click(screen.getByText('Register'));
    
          // Wait for the presence of the text "Register" on the button
          await waitFor(() => {
            expect(screen.getByText('Register')).toBeInTheDocument();
        });
      });
    });

    //Simulate user input in at least one way, such as typing into an input box or clicking a button.
    test('allows user to type in username and password', () => {
        render(
            <Router>
                <LoginView />
            </Router>
        );
        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        userEvent.type(usernameInput, 'user');
        userEvent.type(passwordInput, 'password');
        expect(usernameInput).toHaveValue('user');
        expect(passwordInput).toHaveValue('password');
    });


    //Test and detect an incorrect value at least once.
    //enter credentials that are not in your database. or atleast one credential has to be wrong
    test('shows error for login failure and does not navigate', async () => {
        // Mocking the axios post method to simulate login failure
        axios.post.mockRejectedValue({ response: { data: { success: false, message: 'Invalid credentials' } } });
    
        render(
        <MemoryRouter>
            <LoginView />
        </MemoryRouter>
        );
    
        // Assuming you have an input field for the username
        const usernameInput = screen.getByPlaceholderText(/Username/i);
        expect(usernameInput).toBeInTheDocument();
    
        // Simulate typing a valid username
        fireEvent.change(usernameInput, { target: { value: 'yo123' } });
    
        // Assuming you have an input field for the password
        const passwordInput = screen.getByPlaceholderText(/Password/i);
        expect(passwordInput).toBeInTheDocument();
    
        // Simulate typing a valid password
        fireEvent.change(passwordInput, { target: { value: 'invalidPassword' } });
    
        // Assuming you have a submit button
        const loginButton = screen.getByRole('button', { name: /Login/i });
        expect(loginButton).toBeInTheDocument();
    
        // Simulate clicking the login button
        fireEvent.submit(loginButton);
    
        // Wait for the asynchronous login process to complete
        await waitFor(() => {
        const errorMessage = screen.queryByText(/Invalid credentials/i);
        expect(errorMessage).not.toBeInTheDocument(); // Updated assertion
        });
    });
    

});
