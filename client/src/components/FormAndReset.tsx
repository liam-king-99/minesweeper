import './Board.css'

export interface FormAndResetProps {
    resetHandler: () => void,
    formChangeHandler: () => void
}

const FormAndReset = ({ resetHandler, formChangeHandler }: FormAndResetProps) => 
{

    return (
        <div className='DifficultyFormAndReset'>
            <select defaultValue={'Intermediate'} onChange={formChangeHandler}>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
            </select>
            <button onClick={resetHandler}>Reset</button>
        </div>
    )
    
}

export default FormAndReset;
