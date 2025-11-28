
import clsx from 'clsx';
import s from './Spinner.module.scss';

interface ISpinnerProps {
    size: 'small' | 'medium' | 'big'
}

const Spinner = ({ size }: ISpinnerProps) => {
    return <div className={clsx(s.spinner, s[`spinner--size-${size}`])}>
        <div className={s[`spinner__external`]}>
        </div>
        <div className={s[`spinner__internal`]}>
        </div>
    </div>
}

export default Spinner;