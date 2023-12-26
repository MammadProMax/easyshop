import "@testing-library/jest-dom";
import { getByText, render, screen } from "@testing-library/react";
import Page from "@/app/test/page";

describe("Test Page", () => {
   it("should render a page title", () => {
      const { getByText } = render(<Page />);

      expect(getByText("page")).toBeInTheDocument();
   });

   it("should render a test paragraph", () => {
      render(<Page />);
      const paragraph = screen.getByText("test", {
         exact: false,
         selector: "p",
      });
      expect(paragraph).toBeInTheDocument();
   });
});
