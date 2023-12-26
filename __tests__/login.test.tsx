import "@testing-library/jest-dom";
import { getByText, render, screen } from "@testing-library/react";
import Login from "@/components/auth/Login";

describe("Login", () => {
   describe("render", () => {
      it("should render a email input", () => {
         //  jest.mock("next-auth/react", () => ({ SignIn: () => {} })); nextauth has issue
         render(<Login />);
      });

      //   it("should render a  email input", () => {
      //      jest.mock("next-auth/react");
      //      render(<Login />);
      //   });

      //   it("should render a submit button", () => {
      //      jest.mock("next-auth/react");
      //      render(<Login />);
      //   });
   });
});
