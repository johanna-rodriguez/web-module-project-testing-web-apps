import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ContactForm from "./ContactForm";

test("renders without errors", () => {
  render(<ContactForm />);
});

test("renders the contact form header", () => {
  render(<ContactForm />);
  const header = screen.queryByText(/Contact Form/i);
  console.log(header);

  expect(header).toBeInTheDocument();
  expect(header).toBeTruthy();
  expect(header).toHaveTextContent(/Contact Form/i);
});

test("renders ONE error message if user enters less then 5 characters into firstname.", async () => {
  render(<ContactForm />);
  const firstname = screen.getByLabelText(/first name/i);
  userEvent.type(firstname, "Joha");
  const errors = await screen.findAllByText(/error:/i);
  expect(errors).toHaveLength(1);
});

test("renders THREE error messages if user enters no values into any fields.", async () => {
  render(<ContactForm />);
  const submitButton = screen.getByRole("button");
  userEvent.click(submitButton);
  const errors = await screen.findAllByText(/error:/i);
  expect(errors).toHaveLength(3);
});

test("renders ONE error message if user enters a valid first name and last name but no email.", async () => {
  render(<ContactForm />);
  const firstName = screen.getByLabelText(/first name/i);
  userEvent.type(firstName, "Johanna");
  const lastName = screen.getByLabelText(/last name/i);
  userEvent.type(lastName, "Rodriguez");
  const email = screen.getByLabelText(/email/i);
  userEvent.type(email, "t");
  const errors = await screen.findAllByText(/error:/i);
  expect(errors).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  render(<ContactForm />);
  const email = screen.getByLabelText(/email/i);
  userEvent.type(email, "t");
  const errorMessage = await screen.findByText(
    /email must be a valid email address./i
  );
  expect(errorMessage).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  render(<ContactForm />);
  const submitButton = screen.getByRole("button");
  userEvent.click(submitButton);
  const errorMessage = await screen.findByText(/lastName is a required field/i);
  expect(errorMessage).toBeInTheDocument();
});

test("renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.", async () => {
  render(<ContactForm />);
  const firstName = screen.getByLabelText(/first name/i);
  userEvent.type(firstName, "Johanna");

  const lastName = screen.getByLabelText(/last name/i);
  userEvent.type(lastName, "Rodriguez");

  const email = screen.getByLabelText(/email/i);
  userEvent.type(email, "test@test.com");

  const submitButton = screen.getByRole("button");
  userEvent.click(submitButton);

  const firstNameRender = screen.queryByText(/Johanna/i);
  expect(firstNameRender).toBeInTheDocument();

  const lastNameRender = screen.queryByText(/Rodriguez/i);
  expect(lastNameRender).toBeInTheDocument();

  const emailRender = screen.queryByText(/test@test.com/i);
  expect(emailRender).toBeInTheDocument();

  expect(screen.queryByText("Message:")).not.toBeInTheDocument();
});

test("renders all fields text when all fields are submitted.", async () => {
  render(<ContactForm />);
  const firstName = screen.getByLabelText(/first name/i);
  userEvent.type(firstName, "Johanna");

  const lastName = screen.getByLabelText(/last name/i);
  userEvent.type(lastName, "Rodriguez");

  const email = screen.getByLabelText(/email/i);
  userEvent.type(email, "test@test.com");

  const message = screen.getByLabelText(/message/i);
  userEvent.type(message, "this is a test");

  const submitButton = screen.getByRole("button");
  userEvent.click(submitButton);

  const firstNameRender = screen.queryByText(/Johanna/i);
  expect(firstNameRender).toBeInTheDocument();

  const lastNameRender = screen.queryByText(/Rodriguez/i);
  expect(lastNameRender).toBeInTheDocument();

  const emailRender = screen.queryByText(/test@test.com/i);
  expect(emailRender).toBeInTheDocument();

  expect(screen.getByTestId("messageDisplay")).toHaveTextContent(
    "this is a test"
  );

});
