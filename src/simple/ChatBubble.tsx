import clsx from 'clsx';
import type { HtmlHTMLAttributes, ReactNode } from 'react';
import DatesHelper, { type HumanReadableTime } from '../helpers/DatesHelper';
import s from './ChatBubble.module.scss';
import Tooltip from './Tooltip';
import { UserBubble, type IUserBubbleProps } from './UserBubble';

interface IChatBubbleProps extends HtmlHTMLAttributes<HTMLDivElement> {
    /** The user props. FirstName and LastName are mandatory */
    user: IUserBubbleProps
    /** The creation date of the message */
    createdOn: Date,
    /** A custom footer. Can be used to display a modified status, a download link, etc... */
    footer?: ReactNode
    /** Set the bubble orientation */
    position: 'left' | 'right'
    /** A method that converts a HumanReadableTime object into a string.
     * It takes a value and a unit, where the unit is one of: "minute" | "hour" | "day" | "date" | "now".
     * date unit does not need to be translated
     */
    i18nDurationAdapter?: (time: HumanReadableTime) => string
    backgroundColor?: string
}

const i18nDefautlAdapter = (time: HumanReadableTime): string => {
    return `${time.value} ${time} ago`;
}

const ChatBubble = ({
    user,
    createdOn,
    footer,
    className,
    children,
    position,
    i18nDurationAdapter = i18nDefautlAdapter,
    backgroundColor,
    ...props
}: IChatBubbleProps) => {
    const createdOnHuman = i18nDurationAdapter(DatesHelper.toHumanReadableTime(createdOn));

    const styleVars: React.CSSProperties = {
        ["--background-color-bubble" as any]: backgroundColor
    };

    return <div className={clsx(s['chat-bubble'], s[`chat-bubble--position-${position}`], className)} {...props}>
        <div className={s['chat-bubble__user']}>
            <UserBubble {...user} />
        </div>
        <div className={s['chat-bubble__content']} style={styleVars}>
            <div className={s['chat-bubble__content__user-info']}>
                <div>
                    {user.firstName} {user.lastName}
                </div>
                <Tooltip title={`${createdOn.toLocaleDateString()} - ${createdOn.toLocaleTimeString()}`} placement='right'>
                    <div className={s['chat-bubble__content__user-info__date']}>
                        {createdOnHuman}
                    </div>
                </Tooltip>
            </div>
            <div className={s['chat-bubble__content__children']}>
                {children}
            </div>
            {footer &&
                <div>
                    {footer}
                </div>
            }
        </div>
    </div>
}

export default ChatBubble;