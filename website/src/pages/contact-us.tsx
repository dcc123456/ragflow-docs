import { createContext, useContext, useEffect, useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";

import {
  LucideAlertCircle,
  LucideCheck,
  LucideLoaderCircle,
} from "lucide-react";

import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";

import FxGradientText from "@site/src/utils/visual-effects/FxGradientText";
import { useTranslations } from "@site/src/utils/useTranslations";

import styles from "./index.module.scss";
import { cn } from "../utils/twUtils";

type ContactUsFormValues = {
  first_name: string;
  last_name: string;
  company: string;
  email: string;
  question: string;
};

const MESSAGE_ENDPOINT = "https://mail.ragflow.io:9378/v1/messages";
const DEFAULT_FORM_VALUES: ContactUsFormValues = {
  first_name: "",
  last_name: "",
  company: "",
  email: "",
  question: "",
};

const FormContext = createContext<ReturnType<typeof useForm>>(null);

function SubmitButton() {
  const form = useContext(FormContext);
  const [visualResultState, setVisualResultState] = useState<
    "idle" | "success" | "error"
  >("idle");
  const { t } = useTranslations("contact");

  const { isPending, mutate } = useMutation({
    mutationFn: async (data: FormData) => {
      const values = {
        first_name: data.get("first_name") as string,
        last_name: data.get("last_name") as string,
        company: data.get("company") as string,
        email: data.get("email") as string,
        question: data.get("question") as string,
      };

      const response = await fetch(MESSAGE_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to submit form", {
          cause: response,
        });
      }

      return;
    },
    onSuccess: () => {
      form.reset();
      setVisualResultState("success");
    },
    onError: () => {
      setVisualResultState("error");
    },
  });

  useEffect(() => {
    if (visualResultState === "success" || visualResultState === "error") {
      const timeout = setTimeout(() => {
        setVisualResultState("idle");
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [visualResultState, isPending]);

  const getButtonText = () => {
    if (isPending) return t("submitting");
    if (visualResultState === "success") return t("submitted");
    if (visualResultState === "error") return t("errorSubmitting");
    return t("submit");
  };

  return (
    <button
      type="submit"
      formAction={mutate}
      className={cn(
        "inline-flex items-center justify-center gap-2",
        "text-sm bg-theme-black hover:bg-theme-black/80 focus:bg-theme-black/80",
        "disabled:bg-theme-black/50",
        isPending && "cursor-progress",
        visualResultState === "idle" ? "!text-theme-white" : "cursor-default",
        visualResultState === "success" && "!bg-success !text-theme-black",
        visualResultState === "error" &&
          "!bg-danger !text-theme-black animate-shake-once",
      )}
      disabled={isPending || visualResultState !== "idle"}
    >
      {isPending ? (
        <LucideLoaderCircle className="animate-spin" />
      ) : visualResultState === "success" ? (
        <LucideCheck />
      ) : visualResultState === "error" ? (
        <LucideAlertCircle />
      ) : null}

      <span>{getButtonText()}</span>
    </button>
  );
}

function Form<T = ReturnType<typeof useForm>>(
  props: React.PropsWithChildren<{ form: T }>,
) {
  const { children, form } = props;

  return <FormContext.Provider value={form}>{children}</FormContext.Provider>;
}

export default function ContactUs() {
  const { siteConfig } = useDocusaurusContext();
  const { t } = useTranslations("contact");

  const form = useForm({
    defaultValues: DEFAULT_FORM_VALUES,
  });

  return (
    <Layout
      title={t("title")}
      description={siteConfig.tagline}
      wrapperClassName={styles.page}
    >
      <div
        className="
        text-standard text-sm mobile:text-base
        container max-desktop:px-page
        pt-12 mobile:pt-20 desktop:pt-24
        pb-16 mobile:pb-28 desktop:pb-32
        grid grid-cols-1 xl:grid-cols-2 gap-24 items-start"
      >
        <header className="pt-8 py-10 h-full flex flex-col justify-between">
          <div>
            <h1 className="text-5xl font-semibold mb-12">
              <FxGradientText preset="primary" direction="right">
                {t("subtitle")}
              </FxGradientText>
            </h1>

            <p className="text-2xl text-standard leading-relaxed">
              {t("salesInfo")}
            </p>
          </div>

          {/* <div className="mt-16 w-full">
            <IndexTestimonials
              rows={1}
            />
          </div> */}
        </header>

        <article className="p-10 border-0.5 border-solid border-component rounded-xl">
          <header className="mb-12">
            <h2>{t("formTitle")}</h2>
          </header>

          <Form form={form}>
            <form className="grid grid-cols-2 gap-x-8 gap-y-6">
              <form.Field name="first_name">
                {(field) => (
                  <label>
                    <div>{t("firstName")}</div>

                    <input
                      type="text"
                      name={field.name}
                      value={field.state.value}
                      placeholder={t("firstName")}
                      autoComplete="given-name"
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </label>
                )}
              </form.Field>

              <form.Field name="last_name">
                {(field) => (
                  <label>
                    <div>{t("lastName")}</div>
                    <input
                      type="text"
                      name={field.name}
                      value={field.state.value}
                      placeholder={t("lastName")}
                      autoComplete="family-name"
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </label>
                )}
              </form.Field>

              <form.Field name="company">
                {(field) => (
                  <label className="col-span-full">
                    <div>{t("companyName")}</div>

                    <input
                      type="text"
                      name={field.name}
                      value={field.state.value}
                      placeholder={t("companyName")}
                      autoComplete="organization"
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </label>
                )}
              </form.Field>

              <form.Field name="email">
                {(field) => (
                  <label className="col-span-full">
                    <div>{t("email")}</div>

                    <input
                      type="email"
                      name={field.name}
                      required
                      value={field.state.value}
                      placeholder={t("email")}
                      autoComplete="email"
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </label>
                )}
              </form.Field>

              <form.Field name="question">
                {(field) => (
                  <label className="col-span-full">
                    <div>{t("question")}</div>

                    <textarea
                      name={field.name}
                      value={field.state.value}
                      placeholder={t("questionPlaceholder")}
                      autoComplete="off"
                      rows={4}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </label>
                )}
              </form.Field>

              <div className="text-right mt-4 col-span-full">
                <SubmitButton />
              </div>
            </form>
          </Form>
        </article>
      </div>
    </Layout>
  );
}
