import React from 'react';

interface PortalIconProps {
    size?: number;
    className?: string;
}

/**
 * The Portal brand icon — layered concentric circles in deep navy blues,
 * masked to a clean circular shape. Used as the "O" in P[O]RTAL branding,
 * sidebar collapsed icon, and standalone mark.
 */
export const PortalIcon: React.FC<PortalIconProps> = ({ size = 28, className = '' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 795 795"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
        focusable="false"
    >
        <g transform="translate(397.5, 397.5) scale(1.13) translate(-397.5, -397.5)">
            <mask id="portal-mask" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="123" y="123" width="549" height="549">
                <path d="M672 397.5C672 549.102 549.102 672 397.5 672C245.898 672 123 549.102 123 397.5C123 245.898 245.898 123 397.5 123C549.102 123 672 245.898 672 397.5Z" fill="#0D2F60" />
            </mask>
            <g mask="url(#portal-mask)">
                <path d="M672 397.5C672 549.102 549.102 672 397.5 672C245.898 672 123 549.102 123 397.5C123 245.898 245.898 123 397.5 123C549.102 123 672 245.898 672 397.5Z" fill="#0D2F60" />
                <path d="M618 397.5C618 545.788 497.788 666 349.5 666C201.212 666 81 545.788 81 397.5C81 249.212 201.212 129 349.5 129C497.788 129 618 249.212 618 397.5Z" fill="#0B1A44" />
                <path d="M561 397.5C561 544.132 442.132 663 295.5 663C148.868 663 30 544.132 30 397.5C30 250.868 148.868 132 295.5 132C442.132 132 561 250.868 561 397.5Z" fill="#083885" />
                <path d="M489 397.5C489 532.534 379.534 642 244.5 642C109.466 642 0 532.534 0 397.5C0 262.466 109.466 153 244.5 153C379.534 153 489 262.466 489 397.5Z" fill="#042F7E" />
                <path d="M435 397.5C435 532.534 325.534 642 190.5 642C55.4664 642 -54 532.534 -54 397.5C-54 262.466 55.4664 153 190.5 153C325.534 153 435 262.466 435 397.5Z" fill="#4487D6" />
                <path d="M369 397.5C369 525.906 264.906 630 136.5 630C8.0938 630 -96 525.906 -96 397.5C-96 269.094 8.0938 165 136.5 165C264.906 165 369 269.094 369 397.5Z" fill="#77B7ED" />
                <path d="M297 397.5C297 517.622 199.622 615 79.5 615C-40.6219 615 -138 517.622 -138 397.5C-138 277.378 -40.6219 180 79.5 180C199.622 180 297 277.378 297 397.5Z" fill="#B7E4F7" />
            </g>
        </g>

    </svg>
);
