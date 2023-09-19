import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <main
      id="wmcads-main-content"
      className="wmcads-container wmcads-container--main wmcads-m-t-lg"
    >
      <h1>Page not found</h1>
      <div>
        <h2>Status code: 404</h2>

        <p>This might be because:</p>
        <ul>
          <li>We’ve moved, updated or deleted the page you are looking for</li>
          <li>
            We’ve recently reorganised the website, so the page you are looking
            for may have a new web address
          </li>
          <li>
            You’re using an old bookmark or you’ve typed the wrong web address.
          </li>
        </ul>
        <p>If you entered a web address, check it is correct.</p>
        <p>
          You can find the page you need from the{" "}
          <a
            href="https://www.wmca.org.uk/"
            title="West Midlands Combined Authority"
          >
            West Midlands Combined Authority homepage
          </a>
          . You can also use the search in the header menu to find the
          information you need.
        </p>
      </div>
    </main>
  );
}
