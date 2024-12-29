/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import {
    useState
} from "react"
import {
    toast
} from "sonner"
import {
    useForm
} from "react-hook-form"
import {
    zodResolver
} from "@hookform/resolvers/zod"
import {
    cn
} from "@/lib/utils"
import {
    Button
} from "@/components/ui/button"
import * as z from "zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Input
} from "@/components/ui/input"
import {
    format
} from "date-fns"
import {
    Calendar
} from "@/components/ui/calendar"
import {
    Calendar as CalendarIcon,
    Loader2
} from "lucide-react"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Check,
    ChevronsUpDown
} from "lucide-react"
import {
    PhoneInput
} from "@/components/ui/phone-input";
import { Session } from "next-auth"
import { genders, institutions, lawFields, LawyerRegisterSchema, localities } from "@/types/lawyer"
import {
    MultiSelector,
    MultiSelectorContent,
    MultiSelectorInput,
    MultiSelectorItem,
    MultiSelectorList,
    MultiSelectorTrigger
} from "@/components/ui/multi-select"
import { Textarea } from "@/components/ui/textarea"
import LocationSelector from "@/components/ui/location-input"
import { TagsInput } from "@/components/ui/tags-input"
import { RegisterLawyer } from "@/actions/register-lawyer"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

export default function LawyerRegistrationForm({ session }: { session: Session | null }) {
    const router = useRouter();
    const [countryName, setCountryName] = useState<string>('')
    const [stateName, setStateName] = useState<string>('')

    const form = useForm<z.infer<typeof LawyerRegisterSchema>>({
        resolver: zodResolver(LawyerRegisterSchema),
        defaultValues: {
            "dob_lawyer_registration": (() => {
                const date = new Date();
                date.setFullYear(date.getFullYear() - 18);
                return date;
            })(),
            "degree_lawyer_registration": ["Bachelor of Laws (LL.B)"],
            "tags_lawyer_registration": ["lawyer"],
            "email_lawyer_registration": session?.user.email || "",
            "pubemail_lawyer_registration": session?.user.email || "",
            "location_lawyer_registration": ["Mumbai Metropolitian Region", "Maharashtra"],
        }
    })

    const { mutate, isPending } = useMutation({
        mutationKey: ["createWorkflow"],
        mutationFn: RegisterLawyer,
        onSuccess: (result) => {
            toast.success("Successfully Registered as Lawyer", { id: "create-lawyer" });
            router.push(`/getting-started`)
        },
        onError: (error) => {
            toast.error(`Failed to Register as Lawyer ${error.message}`, {id: "create-lawyer"})
        }
    });

    function onSubmit(values: z.infer<typeof LawyerRegisterSchema>) {
        try {
            toast.loading(`Registering as Lawyer ${"Loading ..."}`, { id: "create-lawyer" });
            mutate(values);
        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Failed to submit the form. Please try again.");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">

                <div className="grid grid-cols-12 gap-4">

                    <div className="col-span-6">

                        <FormField
                            control={form.control}
                            name="fname_lawyer_registration"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Tony"

                                            type="text"
                                            {...field} />
                                    </FormControl>
                                    <FormDescription>This is your public first name.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="col-span-6">

                        <FormField
                            control={form.control}
                            name="lname_lawyer_registration"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Stark"

                                            type="text"
                                            {...field} />
                                    </FormControl>
                                    <FormDescription>This is your public last name.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                </div>

                <FormField
                    control={form.control}
                    name="dob_lawyer_registration"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Date of birth</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormDescription>Your date of birth is used to calculate your age.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="gender_lawyer_registration"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Gender</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                "w-[200px] justify-between",
                                                !field.value && "text-muted-foreground"
                                            )}

                                        >
                                            {field.value
                                                ? genders.find(
                                                    (gender) => gender.value === field.value
                                                )?.label
                                                : "Select Gender"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search Gender..." />
                                        <CommandList>
                                            <CommandEmpty>No language found.</CommandEmpty>
                                            <CommandGroup>
                                                {genders.map((gender) => (
                                                    <CommandItem
                                                        value={gender.label}
                                                        key={gender.value}
                                                        onSelect={() => {
                                                            form.setValue("gender_lawyer_registration", gender.value);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                gender.value === field.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {gender.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormDescription>The gender you identify as</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="phnumber_lawyer_registration"
                    render={({ field }) => (
                        <FormItem className="flex flex-col items-start">
                            <FormLabel>Phone number</FormLabel>
                            <FormControl className="w-full">
                                <PhoneInput
                                    {...field}
                                    defaultCountry="IN"
                                />
                            </FormControl>
                            <FormDescription>Enter your phone number.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email_lawyer_registration"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="tony@starkindustries.com"
                                    disabled={session?.user.email !== null}
                                    type="email"
                                    {...field} />
                            </FormControl>
                            <FormDescription>This is your email address.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="locality_lawyer_registration"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Select Locality </FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                "w-[200px] justify-between",
                                                !field.value && "text-muted-foreground"
                                            )}

                                        >
                                            {field.value
                                                ? localities.find(
                                                    (locality) => locality.value === field.value
                                                )?.label
                                                : "Select Locality"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search Locality..." />
                                        <CommandList>
                                            <CommandEmpty>No language found.</CommandEmpty>
                                            <CommandGroup>
                                                {localities.map((locality) => (
                                                    <CommandItem
                                                        value={locality.label}
                                                        key={locality.value}
                                                        onSelect={() => {
                                                            form.setValue("locality_lawyer_registration", locality.value);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                locality.value === field.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {locality.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormDescription>This is the place where you practice</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="degree_lawyer_registration"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Select your Degrees</FormLabel>
                            <FormControl>
                                <MultiSelector
                                    values={field.value}
                                    onValuesChange={field.onChange}
                                    loop
                                    className=""
                                >
                                    <MultiSelectorTrigger>
                                        <MultiSelectorInput placeholder="Select languages" />
                                    </MultiSelectorTrigger>
                                    <MultiSelectorContent>
                                        <MultiSelectorList>
                                            {lawFields.map((lawField, index) => {
                                                return <MultiSelectorItem key={index} value={lawField.value}>{lawField.label}</MultiSelectorItem>
                                            })
                                            }
                                        </MultiSelectorList>
                                    </MultiSelectorContent>
                                </MultiSelector>
                            </FormControl>
                            <FormDescription>Select the degree(s) you have completed till now.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="institution_lawyer_registration"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Institution</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                "w-[400px] justify-between",
                                                !field.value && "text-muted-foreground"
                                            )}

                                        >
                                            {field.value
                                                ? institutions.find(
                                                    (institution) => institution.value === field.value
                                                )?.label
                                                : "Select Institution"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search Institution..." />
                                        <CommandList>
                                            <CommandEmpty>No language found.</CommandEmpty>
                                            <CommandGroup>
                                                {institutions.map((institution) => (
                                                    <CommandItem
                                                        value={institution.label}
                                                        key={institution.value}
                                                        onSelect={() => {
                                                            form.setValue("institution_lawyer_registration", institution.value);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                institution.value === field.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {institution.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormDescription>Select the Institution where you work</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="about_lawyer_registration"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>About Yourself</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder=""
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>Write about yourself</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="pubweburl_lawyer_registration"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Website URL</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="https://www.linkedin.com"

                                            type="text"
                                            {...field} />
                                    </FormControl>
                                    <FormDescription>This is your public Website URL.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="pubemail_lawyer_registration"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Public Email Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="avengers@starkindustries.com"
                                            disabled={session?.user.email !== null}
                                            type="email"
                                            {...field} />
                                    </FormControl>
                                    <FormDescription>This is your public Public Email Address,</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="num_cases_performed_lawyer_registration"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cases Performed</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="10"

                                    type="text"
                                    {...field} />
                            </FormControl>
                            <FormDescription>This is the number of cases you&apos;ve performed till now.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* <FormField
                    control={form.control}
                    name="location_lawyer_registration"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Consulting Location</FormLabel>
                            <FormControl>
                                <LocationSelector
                                    onCountryChange={(country) => {
                                        setCountryName(country?.name || '')
                                        form.setValue(field.name, [country?.name || '', stateName || ''])
                                    }}
                                    onStateChange={(state) => {
                                        setStateName(state?.name || '')
                                        form.setValue(field.name, [countryName || '', state?.name || ''])
                                    }}
                                />
                            </FormControl>
                            <FormDescription>If your country has states, it will be appear after selecting country</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                /> */}

                <FormField
                    control={form.control}
                    name="tags_lawyer_registration"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                                <TagsInput
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    placeholder="Enter your tags"
                                />
                            </FormControl>
                            <FormDescription>Add tags.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}