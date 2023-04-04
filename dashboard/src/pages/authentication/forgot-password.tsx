/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import type { FC } from "react";

const ForgotPasswordPage: FC = function () {
  return (
    <div className="flex flex-col items-center justify-center px-6 lg:h-screen lg:gap-y-12">
      <div className="my-6 flex items-center gap-x-1 lg:my-0">
        <img
          alt="Flowbite logo"
          src="https://flowbite.com/docs/images/logo.svg"
          className="mr-3 h-12"
        />
        <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
          Flowbite
        </span>
      </div>
      <Card className="w-full lg:max-w-[640px] lg:[&>*]:w-full lg:[&>*]:p-16">
        <h1 className="text-2xl font-bold dark:text-white md:text-3xl">
          Forgot your password?
        </h1>
        <p className="mb-3 text-gray-500 dark:text-gray-300">
          Don't fret! Just type in your email and we will send you a code to
          reset your pasword!
        </p>
        <form>
          <div className="mb-6 flex flex-col gap-y-3">
            <Label htmlFor="email">Your email</Label>
            <TextInput
              id="email"
              name="email"
              placeholder="name@company.com"
              type="email"
            />
          </div>
          <div className="mb-6 flex items-center gap-x-3">
            <Checkbox id="acceptTerms" name="acceptTerms" />
            <Label htmlFor="acceptTerms">
              I accept the&nbsp;
              <a href="#" className="text-primary-700 dark:text-primary-300">
                Terms and Conditions
              </a>
            </Label>
          </div>
          <div>
            <Button type="submit" className="w-full lg:w-auto">
              Reset password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
