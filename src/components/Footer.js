import React from 'react';

export default function Footer() {
    return (
        <React.Fragment>
            <footer className="footer">
                <div className="content has-text-centered">
                    <small>
                        * If GET request is not completed within 5s, url is marked with TIMEOUT tag.
                    </small>
                    <p className="mt-6">
                        <a href="#top" className="has-text-black">Go to Top</a>
                    </p>
                </div>
            </footer>
        </React.Fragment>
    );
}
