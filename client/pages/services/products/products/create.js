import {useState} from "react";
import Router from "next/router";
import useRequest from "../../../../hooks/use-request";
import MaterialsList from "../../materials/inventory";
import * as ReactDOM from "react-dom";

const CreateProduct = ({stepList, steps}) => {
    const [name, setName] = useState("");
    const [value, setValue] = useState("");
    const [SKU, setSKU] = useState("");
    const [step, setStep] = useState("");
    const {doRequest, errors} = useRequest({
        url: "/api/products/products/",
        method: "post",
        body: {
            name,
            value,
            SKU,
            steps
        },
        onSuccess: (product) => Router.push("/services/products/products/[productId]",
            `/services/products/products/${product.id}`)
    });

    const onSubmit = async event => {
        event.preventDefault();

        await doRequest();
    };

    const onBlur = () => {
        if (isNaN(parseFloat(value))) {
            setValue("");
        }
    };
    const stepSelector = stepList.map((s) => {
        let description = "";
        if (s.machine !== undefined) {
            description = `Machine: ${s.machine} Material: ${s.material} Quantity: ${s.quantity} Time: ${s.stepTime}`;
        } else if (s.material !== undefined) {
            description = `Machine: None Material: ${s.material} Quantity: ${s.quantity} Time: ${s.stepTime}`;
        } else {
            description = `Machine: None Material: None Time: ${s.stepTime}`;
        }
        return <option key={s.id} value={s.id}>
            Step: {s.name} {description}
        </option>;
    });

    const renderSteps = () => {
        let i = 0;
        const stepsToRender = steps.map(listStep => {
            i++;
            for (let stepNum = 0; stepNum < stepList.length; stepNum++) {
                if (stepList[stepNum].id === listStep) {
                    return <h3 key={i}>Step {i}: {stepList[stepNum].name}</h3>;
                }
            }
        });
        ReactDOM.render(<div><h2>Steps</h2>{stepsToRender}</div>, document.getElementById("steps"));
    };

    const onStepSubmit = async event => {
        event.preventDefault();
        if (step !== "") {
            steps.push(step);
            renderSteps();
        }
    };

    return (<>
            <form>
                <h1>Create Product</h1>
                <div className="form-group">
                    <label>Product Name</label>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Value</label>
                    <input
                        value={value}
                        onBlur={onBlur}
                        onChange={e => setValue(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>SKU</label>
                    <input
                        value={SKU}
                        onChange={e => setSKU(e.target.value)}
                        className="form-control"
                    />
                </div>

            </form>
            <div id={"steps"}></div>
            <form onSubmit={onStepSubmit}>
                <h1>Add Step</h1>
                <div className="form-group">
                    <label>Step/Info</label>
                    <select className={"form-select form-select-lg mb-3"} aria-label={".form-select-lg"}
                            onChange={e => {
                                setStep(e.target.value);
                            }}>
                        <option value={""}>Step</option>
                        {stepSelector}
                    </select>
                </div>
                <button className="btn btn-primary">Add</button>
            </form>
            <br/>

            <form onSubmit={onSubmit}>
                {errors}
                <button className="btn btn-primary">Create</button>
            </form>
        </>
    );
};

CreateProduct.getInitialProps = async (context, client) => {
    const {data} = await client.get("/api/products/steps/");
    let steps = [];
    return {stepList: data, steps, title: "Create Step"};
};

export default CreateProduct;